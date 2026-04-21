#!/usr/bin/env python3
"""
Daily Reflection Tree Agent
Loads a reflection tree from JSON and walks the user through it deterministically.
No LLM calls — pure tree walking with state accumulation.
"""

import json
import sys
from typing import Dict, List, Optional
from pathlib import Path


class ReflectionTree:
    def __init__(self, tree_path: str):
        with open(tree_path, 'r') as f:
            self.data = json.load(f)
        self.nodes = {node['id']: node for node in self.data['nodes']}
        self.state = {
            'answers': {},
            'axis1': {'internal': 0, 'external': 0},
            'axis2': {'contribution': 0, 'entitlement': 0},
            'axis3': {'self_centric': 0, 'transcendent': 0},
        }
        self.path_taken = []

    def get_node(self, node_id: str) -> Optional[Dict]:
        return self.nodes.get(node_id)

    def record_answer(self, node_id: str, answer: str):
        self.state['answers'][node_id] = answer
        self.path_taken.append((node_id, answer))

    def process_signal(self, signal: Optional[str]):
        if not signal:
            return
        parts = signal.split(':')
        if len(parts) == 2:
            axis_key, pole = parts
            if axis_key in self.state and pole in self.state[axis_key]:
                self.state[axis_key][pole] += 1

    def get_dominant(self, axis_name: str) -> str:
        axis = self.state[axis_name]
        if axis_name == 'axis1':
            if axis['internal'] > axis['external']:  return 'internal'
            if axis['external'] > axis['internal']:  return 'external'
            return 'balanced'
        if axis_name == 'axis2':
            if axis['contribution'] > axis['entitlement']:  return 'contribution'
            if axis['entitlement'] > axis['contribution']:  return 'entitlement'
            return 'balanced'
        if axis_name == 'axis3':
            if axis['transcendent'] > axis['self_centric']:  return 'altrocentric'
            if axis['self_centric'] > axis['transcendent']:  return 'self-centric'
            return 'balanced'
        return 'balanced'

    def interpolate_text(self, text: str) -> str:
        result = text
        for node_id, answer in self.state['answers'].items():
            result = result.replace(f'{{{node_id}.answer}}', answer)
        result = result.replace('{axis1.dominant}', self.get_dominant('axis1'))
        result = result.replace('{axis2.dominant}', self.get_dominant('axis2'))
        result = result.replace('{axis3.dominant}', self.get_dominant('axis3'))
        return result

    def route_decision(self, node: Dict, answer: Optional[str]) -> Optional[str]:
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
            node = self.get_node(current_node_id)
            if not node:
                print(f"Error: Node '{current_node_id}' not found.")
                break

            t    = node['type']
            text = self.interpolate_text(node['text'])

            if t == 'start':
                print(f"\n{text}\n")
                current_node_id = node['target']

            elif t == 'bridge':
                print(f"\n── {text}\n")
                current_node_id = node['target']

            elif t == 'question':
                print(f"\n{text}")
                options = node['options']
                for i, opt in enumerate(options, 1):
                    print(f"  {i}) {opt}")

                while True:
                    try:
                        choice = input("\nYour choice (number): ").strip()
                        idx    = int(choice) - 1
                        if 0 <= idx < len(options):
                            last_answer = options[idx]
                            self.record_answer(current_node_id, last_answer)
                            break
                        else:
                            print("Invalid choice. Try again.")
                    except (ValueError, KeyboardInterrupt):
                        print("\nPlease enter a number.")

                # Find child decision node
                decision_node = next(
                    (n for n in self.nodes.values()
                     if n.get('parentId') == current_node_id and n['type'] == 'decision'),
                    None
                )
                current_node_id = decision_node['id'] if decision_node else None

            elif t == 'decision':
                next_id = self.route_decision(node, last_answer)
                if next_id:
                    target_node = self.get_node(next_id)
                    if target_node and target_node.get('signal'):
                        self.process_signal(target_node['signal'])
                    current_node_id = next_id
                else:
                    print("Error: Decision routing failed.")
                    break

            elif t == 'reflection':
                print(f"\n  ✦  {text}\n")
                if node.get('signal'):
                    self.process_signal(node['signal'])
                input("  Press Enter to continue...")
                current_node_id = node['target']

            elif t == 'summary':
                print(f"\n{text}\n")
                print("=" * 56)
                print("  YOUR REFLECTION SUMMARY")
                print("=" * 56)
                print(f"  Agency (Locus):        {self.get_dominant('axis1').title()}")
                print(f"  Orientation:           {self.get_dominant('axis2').title()}")
                print(f"  Perspective (Radius):  {self.get_dominant('axis3').title()}")
                print("=" * 56)
                input("\n  Press Enter to close...")
                current_node_id = node['target']

            elif t == 'end':
                print(f"\n{text}\n")
                break


def main():
    tree_path = Path(__file__).parent / 'reflection_tree.json'
    if not tree_path.exists():
        print(f"Error: reflection_tree.json not found at {tree_path}")
        sys.exit(1)

    print("\n" + "=" * 56)
    print("  DAILY REFLECTION TREE")
    print("=" * 56)

    tree = ReflectionTree(str(tree_path))
    tree.walk()
    print("Session complete.\n")


if __name__ == '__main__':
    main()
