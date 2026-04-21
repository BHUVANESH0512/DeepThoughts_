#!/usr/bin/env python3
"""
Transcript Generator — simulates two personas walking the reflection tree.
Run: python transcript_gen.py
"""

import json
from typing import Dict, Optional
from pathlib import Path


class TranscriptAgent:
    def __init__(self, tree_path: str, persona_answers: Dict[str, str]):
        with open(tree_path, 'r') as f:
            self.data = json.load(f)
        self.nodes          = {n['id']: n for n in self.data['nodes']}
        self.persona_answers = persona_answers
        self.state = {
            'answers': {},
            'axis1': {'internal': 0, 'external': 0},
            'axis2': {'contribution': 0, 'entitlement': 0},
            'axis3': {'self_centric': 0, 'transcendent': 0},
        }
        self.transcript = []

    def log(self, text: str):
        self.transcript.append(text)

    def process_signal(self, signal: Optional[str]):
        if not signal:
            return
        parts = signal.split(':')
        if len(parts) == 2:
            axis_key, pole = parts
            if axis_key in self.state and pole in self.state[axis_key]:
                self.state[axis_key][pole] += 1

    def get_dominant(self, axis_name: str) -> str:
        a = self.state[axis_name]
        if axis_name == 'axis1':
            if a['internal'] > a['external']:  return 'internal'
            if a['external'] > a['internal']:  return 'external'
            return 'balanced'
        if axis_name == 'axis2':
            if a['contribution'] > a['entitlement']: return 'contribution'
            if a['entitlement'] > a['contribution']: return 'entitlement'
            return 'balanced'
        if axis_name == 'axis3':
            if a['transcendent'] > a['self_centric']: return 'altrocentric'
            if a['self_centric'] > a['transcendent']: return 'self-centric'
            return 'balanced'
        return 'balanced'

    def interpolate(self, text: str) -> str:
        result = text
        for node_id, answer in self.state['answers'].items():
            result = result.replace(f'{{{node_id}.answer}}', answer)
        result = result.replace('{axis1.dominant}', self.get_dominant('axis1'))
        result = result.replace('{axis2.dominant}', self.get_dominant('axis2'))
        result = result.replace('{axis3.dominant}', self.get_dominant('axis3'))
        return result

    def route_decision(self, node: dict, answer: Optional[str]) -> Optional[str]:
        if not answer:
            return None
        for rule in node['options']:
            if ':' not in rule:
                continue
            last_colon = rule.rfind(':')
            cond_part  = rule[:last_colon]
            target     = rule[last_colon + 1:]
            if cond_part.startswith('answer='):
                valid = cond_part[7:].split('|')
                if answer in valid:
                    return target
        return None

    def walk(self):
        current_node_id = 'START'
        last_answer = None

        while current_node_id:
            node = self.nodes.get(current_node_id)
            if not node:
                break
            t    = node['type']
            text = self.interpolate(node['text'])

            if t == 'start':
                self.log(f"Agent: {text}")
                current_node_id = node['target']

            elif t == 'bridge':
                self.log(f"\nAgent: {text}")
                current_node_id = node['target']

            elif t == 'question':
                self.log(f"\nAgent: {text}")
                options = node['options']
                for i, opt in enumerate(options, 1):
                    self.log(f"  {i}) {opt}")

                if current_node_id in self.persona_answers:
                    answer = self.persona_answers[current_node_id]
                    if answer in options:
                        idx = options.index(answer)
                        self.log(f"User: {idx + 1}  ({answer})")
                        last_answer = answer
                        self.state['answers'][current_node_id] = answer
                    else:
                        self.log(f"[ERROR: '{answer}' not in options]")
                        break
                else:
                    self.log(f"[ERROR: no answer defined for {current_node_id}]")
                    break

                decision_node = next(
                    (n for n in self.nodes.values()
                     if n.get('parentId') == current_node_id and n['type'] == 'decision'),
                    None
                )
                current_node_id = decision_node['id'] if decision_node else None

            elif t == 'decision':
                next_id = self.route_decision(node, last_answer)
                if next_id:
                    target_node = self.nodes.get(next_id)
                    if target_node and target_node.get('signal'):
                        self.process_signal(target_node['signal'])
                    current_node_id = next_id
                else:
                    break

            elif t == 'reflection':
                self.log(f"\nAgent: {text}")
                if node.get('signal'):
                    self.process_signal(node['signal'])
                current_node_id = node['target']

            elif t == 'summary':
                self.log(f"\nAgent: {text}")
                self.log(f"\n{'='*50}")
                self.log("REFLECTION SUMMARY")
                self.log(f"{'='*50}")
                self.log(f"Agency (Locus):        {self.get_dominant('axis1').title()}")
                self.log(f"Orientation:           {self.get_dominant('axis2').title()}")
                self.log(f"Perspective (Radius):  {self.get_dominant('axis3').title()}")
                self.log(f"{'='*50}")
                current_node_id = node['target']

            elif t == 'end':
                self.log(f"\nAgent: {text}")
                break

    def get_transcript(self) -> str:
        return '\n'.join(self.transcript)


def main():
    tree_path = Path(__file__).parent / 'reflection_tree.json'
    out_dir   = Path(__file__).parent / 'transcripts'
    out_dir.mkdir(exist_ok=True)

    # ── Persona 1: Victim / Entitled / Self-centric ──────────
    victim_answers = {
        'A1_OPEN':        'Frustrating',
        'A1_Q_AGENCY_LOW':'I felt stuck—not sure what to do',
        'A2_OPEN':        "I felt others weren't pulling their weight",
        'A3_OPEN':        'Just me—my own performance or problem',
    }

    # ── Persona 2: Victor / Contributing / Altrocentric ──────
    victor_answers = {
        'A1_OPEN':         'Productive',
        'A1_Q_AGENCY_HIGH':'I adapted quickly to change',
        'A2_OPEN':         'I helped or taught someone',
        'A3_OPEN':         "The customer or mission we're serving",
    }

    print("\n" + "="*60)
    print("TRANSCRIPT 1 — VICTIM PERSONA")
    print("="*60)
    agent1 = TranscriptAgent(str(tree_path), victim_answers)
    agent1.walk()
    t1 = agent1.get_transcript()
    print(t1)

    victim_md = out_dir / 'transcript_victim.md'
    victim_md.write_text(
        "# Reflection Tree Transcript: Victim Persona\n\n"
        "**Profile:** External locus · Entitlement-oriented · Self-centric\n\n"
        "```\n" + t1 + "\n```\n",
        encoding='utf-8'
    )

    print("\n" + "="*60)
    print("TRANSCRIPT 2 — VICTOR PERSONA")
    print("="*60)
    agent2 = TranscriptAgent(str(tree_path), victor_answers)
    agent2.walk()
    t2 = agent2.get_transcript()
    print(t2)

    victor_md = out_dir / 'transcript_victor.md'
    victor_md.write_text(
        "# Reflection Tree Transcript: Victor Persona\n\n"
        "**Profile:** Internal locus · Contribution-oriented · Altrocentric\n\n"
        "```\n" + t2 + "\n```\n",
        encoding='utf-8'
    )

    print(f"\n✓ Transcripts saved to: {out_dir}\n")


if __name__ == '__main__':
    main()
