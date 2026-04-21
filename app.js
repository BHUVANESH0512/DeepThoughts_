/**
 * Daily Reflection Tree — App Logic
 * Pure deterministic tree walking. No LLM. No backend.
 * Tree data is inlined — works directly from file:// without a server.
 */

/* ── Inline tree data (no fetch needed) ───────────────────── */
const TREE_DATA = {"metadata":{"title":"The Daily Reflection Tree","version":"1.0","description":"A deterministic reflection agent for end-of-day self-awareness. Three axes: Locus (agency), Orientation (contribution), Radius (concern for others).","axes":["Axis 1: Locus (Internal vs External)","Axis 2: Orientation (Contribution vs Entitlement)","Axis 3: Radius (Self-centric vs Altrocentric)"],"sources":["Rotter (1954, 1966) - Locus of Control","Dweck (2006) - Growth Mindset","Campbell et al. (2004) - Psychological Entitlement","Organ (1988) - Organizational Citizenship","Maslow (1969) - Self-Transcendence","Batson (2011) - Perspective-Taking"]},"nodes":[{"id":"START","parentId":null,"type":"start","text":"Good evening. Before you wind down, let's take 5 minutes to reflect on your day.","options":[],"target":"A1_OPEN","signal":null},{"id":"A1_OPEN","parentId":"START","type":"question","text":"How would you sum up today in one word?","options":["Overwhelming","Productive","Mixed","Frustrating"],"target":null,"signal":null},{"id":"A1_D1","parentId":"A1_OPEN","type":"decision","text":"","options":["answer=Productive:A1_Q_AGENCY_HIGH","answer=Mixed:A1_Q_AGENCY_MID","answer=Overwhelming|Frustrating:A1_Q_AGENCY_LOW"],"target":null,"signal":null},{"id":"A1_Q_AGENCY_HIGH","parentId":"A1_D1","type":"question","text":"You said today felt {A1_OPEN.answer}. When something went well, what was the main factor?","options":["I was well-prepared","My team delivered","I adapted quickly to change","Timing and luck aligned"],"target":null,"signal":null},{"id":"A1_Q_AGENCY_MID","parentId":"A1_D1","type":"question","text":"You said today felt {A1_OPEN.answer}. Looking back, what's one thing you directly influenced?","options":["How I responded to setbacks","What I asked for help with","A conversation I initiated","Something I didn't control—things just happened"],"target":null,"signal":null},{"id":"A1_Q_AGENCY_LOW","parentId":"A1_D1","type":"question","text":"You said today felt {A1_OPEN.answer}. When things got difficult, what was your first move?","options":["I figured out what I could control","I vented or waited for clarity","I pushed harder alone","I felt stuck—not sure what to do"],"target":null,"signal":null},{"id":"A1_SIGNAL_INT_HIGH","parentId":"A1_Q_AGENCY_HIGH","type":"decision","text":"","options":["answer=I was well-prepared|I adapted quickly to change:A1_R_INT_HIGH","answer=My team delivered|Timing and luck aligned:A1_R_INT_MID"],"target":null,"signal":"axis1:internal"},{"id":"A1_R_INT_HIGH","parentId":"A1_SIGNAL_INT_HIGH","type":"reflection","text":"That's agency. You see the thread between what you did—prepared, adapted—and what happened. Not everything was in your control, but you were in the game.","options":[],"target":"BRIDGE_1_2","signal":"axis1:internal"},{"id":"A1_R_INT_MID","parentId":"A1_SIGNAL_INT_HIGH","type":"reflection","text":"You recognize both sides: your team's contribution and that things aligned for you today. That balance—seeing what others did and what you benefited from—is rare.","options":[],"target":"BRIDGE_1_2","signal":"axis1:internal"},{"id":"A1_SIGNAL_MID","parentId":"A1_Q_AGENCY_MID","type":"decision","text":"","options":["answer=How I responded to setbacks|A conversation I initiated:A1_R_MID_INT","answer=What I asked for help with:A1_R_MID_BALANCE","answer=Something I didn't control—things just happened:A1_R_MID_EXT"],"target":null,"signal":null},{"id":"A1_R_MID_INT","parentId":"A1_SIGNAL_MID","type":"reflection","text":"There it is. You own your reaction. You didn't just take what came—you shaped it, even in a day that felt mixed. That's the seed of agency.","options":[],"target":"BRIDGE_1_2","signal":"axis1:internal"},{"id":"A1_R_MID_BALANCE","parentId":"A1_SIGNAL_MID","type":"reflection","text":"Asking for help is a form of agency. You didn't pretend to have all the answers—you got what you needed. That's wisdom, not weakness.","options":[],"target":"BRIDGE_1_2","signal":"axis1:internal"},{"id":"A1_R_MID_EXT","parentId":"A1_SIGNAL_MID","type":"reflection","text":"Some days feel more like drift than drive. But somewhere in that drift, you made a choice—if only how to feel about it. That counts.","options":[],"target":"BRIDGE_1_2","signal":"axis1:external"},{"id":"A1_SIGNAL_LOW","parentId":"A1_Q_AGENCY_LOW","type":"decision","text":"","options":["answer=I figured out what I could control:A1_R_LOW_INT","answer=I vented or waited for clarity|I pushed harder alone:A1_R_LOW_EXT_ACTION","answer=I felt stuck—not sure what to do:A1_R_LOW_EXT"],"target":null,"signal":null},{"id":"A1_R_LOW_INT","parentId":"A1_SIGNAL_LOW","type":"reflection","text":"Even when it feels rough, you have a practice: find the boundary between what's yours and what isn't, then move the needle on what's yours. That's grounded thinking.","options":[],"target":"BRIDGE_1_2","signal":"axis1:internal"},{"id":"A1_R_LOW_EXT_ACTION","parentId":"A1_SIGNAL_LOW","type":"reflection","text":"Venting, pushing—those are ways of coping when things are unclear. The real question for tomorrow: what's one thing you want to control differently?","options":[],"target":"BRIDGE_1_2","signal":"axis1:external"},{"id":"A1_R_LOW_EXT","parentId":"A1_SIGNAL_LOW","type":"reflection","text":"Stuck is a real feeling. But stuck isn't permanent. Tomorrow, when confusion hits, try this: name one small thing you can do. Not everything—just one.","options":[],"target":"BRIDGE_1_2","signal":"axis1:external"},{"id":"BRIDGE_1_2","parentId":null,"type":"bridge","text":"Now let's look at another layer: not just how you handled things, but what you gave today.","options":[],"target":"A2_OPEN","signal":null},{"id":"A2_OPEN","parentId":"BRIDGE_1_2","type":"question","text":"Think of a moment from today. Were you mostly focused on what you'd get, or what you could give?","options":["I helped or taught someone","I was focused on recognition or resources","I was supporting the team without asking for credit","I felt others weren't pulling their weight"],"target":null,"signal":null},{"id":"A2_SIGNAL","parentId":"A2_OPEN","type":"decision","text":"","options":["answer=I helped or taught someone|I was supporting the team without asking for credit:A2_R_CONTRIB","answer=I was focused on recognition or resources|I felt others weren't pulling their weight:A2_R_ENTITLE"],"target":null,"signal":null},{"id":"A2_R_CONTRIB","parentId":"A2_SIGNAL","type":"reflection","text":"That's the posture of contribution. You're not keeping score, not waiting for your turn—you're giving first. Orgs run on that energy.","options":[],"target":"BRIDGE_2_3","signal":"axis2:contribution"},{"id":"A2_R_ENTITLE","parentId":"A2_SIGNAL","type":"reflection","text":"When we focus on what we deserve, we stop seeing what we can offer. Notice the frame: less 'What's owed to me?' and more 'What can I add?' Small shift, big difference.","options":[],"target":"BRIDGE_2_3","signal":"axis2:entitlement"},{"id":"BRIDGE_2_3","parentId":null,"type":"bridge","text":"One last piece: zoom out. Your day wasn't just about you.","options":[],"target":"A3_OPEN","signal":null},{"id":"A3_OPEN","parentId":"BRIDGE_2_3","type":"question","text":"When you think about today's biggest challenge or win, who comes to mind?","options":["Just me—my own performance or problem","My team—we were all navigating the same pressures","A specific person who was struggling","The customer or mission we're serving"],"target":null,"signal":null},{"id":"A3_SIGNAL","parentId":"A3_OPEN","type":"decision","text":"","options":["answer=Just me—my own performance or problem:A3_R_SELF_CENTRIC","answer=My team—we were all navigating the same pressures:A3_R_TEAM","answer=A specific person who was struggling|The customer or mission we're serving:A3_R_ALTROCENTRIC"],"target":null,"signal":null},{"id":"A3_R_SELF_CENTRIC","parentId":"A3_SIGNAL","type":"reflection","text":"It's natural for your mind to center on your own stakes, your own stress. But try this: is there anyone your day affected? Even indirectly? Noticing that connection is the beginning of perspective.","options":[],"target":"SUMMARY_CALC","signal":"axis3:self_centric"},{"id":"A3_R_TEAM","parentId":"A3_SIGNAL","type":"reflection","text":"You're already thinking in we. That's not naive—that's how meaningful work feels. Your struggle is part of something shared.","options":[],"target":"SUMMARY_CALC","signal":"axis3:transcendent"},{"id":"A3_R_ALTROCENTRIC","parentId":"A3_SIGNAL","type":"reflection","text":"You're thinking about someone else's experience, not just yours. That kind of perspective—imagining what it felt like for them—is where empathy lives, and where meaning grows.","options":[],"target":"SUMMARY_CALC","signal":"axis3:transcendent"},{"id":"SUMMARY_CALC","parentId":null,"type":"summary","text":"Today you leaned {axis1.dominant} on agency. You approached contribution with a {axis2.dominant} mindset. And your attention spanned from {axis3.dominant} concerns. That's the shape of your day.","options":[],"target":"END","signal":null},{"id":"END","parentId":"SUMMARY_CALC","type":"end","text":"Sleep well. You showed up.","options":[],"target":null,"signal":null}]};

class ReflectionApp {
  constructor() {
    this.treeData   = null;
    this.nodes      = {};
    this.state      = {
      answers: {},
      axis1: { internal: 0, external: 0 },
      axis2: { contribution: 0, entitlement: 0 },
      axis3: { self_centric: 0, transcendent: 0 },
    };
    this.currentNodeId = 'START';
    this.lastAnswer    = null;
    this.questionCount = 0;
    this.totalQuestions = 4;
    this.currentAxis = 1;
  }

  /* ── Bootstrap (no fetch — works from file://) ─────────── */
  init() {
    this.treeData = TREE_DATA;
    this.nodes    = {};
    for (const n of this.treeData.nodes) {
      this.nodes[n.id] = n;
    }
    this.bindUI();
    this.updateClock();
    setInterval(() => this.updateClock(), 60000);
  }

  updateClock() {
    const now  = new Date();
    const h    = now.getHours().toString().padStart(2, '0');
    const m    = now.getMinutes().toString().padStart(2, '0');
    const el   = document.getElementById('header-time');
    if (el) el.textContent = `${h}:${m}`;
  }

  bindUI() {
    document.getElementById('start-btn')
      .addEventListener('click', () => this.startSession());
    document.getElementById('restart-btn')
      .addEventListener('click', () => this.restartSession());
    document.getElementById('new-session-btn')
      .addEventListener('click', () => this.restartSession());
  }

  /* ── Session control ────────────────────────────────────── */
  startSession() {
    this.showScreen('question-screen');
    document.querySelector('.progress-bar-wrap').classList.add('visible');
    document.querySelector('.axis-indicators').classList.add('visible');
    this.advance('START');
  }

  restartSession() {
    // Reset state
    this.state = {
      answers: {},
      axis1: { internal: 0, external: 0 },
      axis2: { contribution: 0, entitlement: 0 },
      axis3: { self_centric: 0, transcendent: 0 },
    };
    this.currentNodeId = 'START';
    this.lastAnswer    = null;
    this.questionCount = 0;
    this.currentAxis   = 1;

    // Reset axis pills
    ['axis-pill-1','axis-pill-2','axis-pill-3'].forEach(id => {
      const el = document.getElementById(id);
      el.classList.remove('active-1','active-2','active-3');
    });

    // Reset progress
    document.getElementById('progress-bar').style.width = '0%';

    this.showScreen('welcome-screen');
    document.querySelector('.progress-bar-wrap').classList.remove('visible');
    document.querySelector('.axis-indicators').classList.remove('visible');
  }

  /* ── Core tree walk ─────────────────────────────────────── */
  advance(nodeId) {
    const node = this.nodes[nodeId];
    if (!node) { console.error('Node not found:', nodeId); return; }

    const t = node.type;

    if (t === 'start') {
      this.advance(node.target);

    } else if (t === 'bridge') {
      this.showBridge(node, () => this.advance(node.target));

    } else if (t === 'question') {
      this.showQuestion(node);

    } else if (t === 'decision') {
      const next = this.routeDecision(node, this.lastAnswer);
      if (next) {
        const targetNode = this.nodes[next];
        if (targetNode && targetNode.signal) this.processSignal(targetNode.signal);
        this.advance(next);
      }

    } else if (t === 'reflection') {
      if (node.signal) this.processSignal(node.signal);
      this.showReflection(node, () => this.advance(node.target));

    } else if (t === 'summary') {
      this.showSummary(node);

    } else if (t === 'end') {
      this.showEnd(node);
    }
  }

  routeDecision(node, answer) {
    if (!answer) return null;
    for (const rule of node.options) {
      if (!rule.includes(':')) continue;
      const lastColon   = rule.lastIndexOf(':');
      const condPart    = rule.substring(0, lastColon);
      const target      = rule.substring(lastColon + 1);
      if (condPart.startsWith('answer=')) {
        const validAnswers = condPart.slice(7).split('|');
        if (validAnswers.includes(answer)) return target;
      }
    }
    return null;
  }

  processSignal(signal) {
    if (!signal) return;
    const [axisKey, pole] = signal.split(':');
    if (this.state[axisKey] && this.state[axisKey][pole] !== undefined) {
      this.state[axisKey][pole]++;
    }
  }

  getDominant(axisName) {
    const a = this.state[axisName];
    if (axisName === 'axis1') {
      if (a.internal > a.external)  return 'internal';
      if (a.external > a.internal)  return 'external';
      return 'balanced';
    }
    if (axisName === 'axis2') {
      if (a.contribution > a.entitlement) return 'contribution';
      if (a.entitlement > a.contribution) return 'entitlement';
      return 'balanced';
    }
    if (axisName === 'axis3') {
      if (a.transcendent > a.self_centric) return 'altrocentric';
      if (a.self_centric > a.transcendent) return 'self-centric';
      return 'balanced';
    }
    return 'balanced';
  }

  interpolate(text) {
    let result = text;
    for (const [nodeId, answer] of Object.entries(this.state.answers)) {
      result = result.replaceAll(`{${nodeId}.answer}`, answer);
    }
    result = result.replaceAll('{axis1.dominant}', this.getDominant('axis1'));
    result = result.replaceAll('{axis2.dominant}', this.getDominant('axis2'));
    result = result.replaceAll('{axis3.dominant}', this.getDominant('axis3'));
    return result;
  }

  /* ── Screen renderers ───────────────────────────────────── */
  showScreen(id) {
    const all = document.querySelectorAll('.screen');
    all.forEach(s => {
      if (s.classList.contains('active')) {
        s.classList.add('leaving');
        setTimeout(() => {
          s.classList.remove('active', 'leaving');
        }, 300);
      }
    });
    setTimeout(() => {
      document.getElementById(id).classList.add('active');
    }, 280);
  }

  showQuestion(node) {
    this.questionCount++;
    this.updateAxis(node.id);
    this.updateProgress();

    const text      = this.interpolate(node.text);
    const axisLabel = this.getAxisLabel(node.id);

    document.getElementById('q-axis-label').textContent  = axisLabel.label;
    document.getElementById('q-axis-label').style.color  = axisLabel.color;
    document.getElementById('question-text').textContent = text;

    const list = document.getElementById('options-list');
    list.innerHTML = '';
    node.options.forEach((opt, i) => {
      const btn  = document.createElement('button');
      btn.className = 'option-btn';
      btn.id        = `option-${i + 1}`;
      btn.innerHTML = `<span class="option-num">${i + 1}</span>${opt}`;
      btn.addEventListener('click', () => this.selectOption(node, opt, btn, list));
      list.appendChild(btn);
    });

    this.showScreen('question-screen');
  }

  selectOption(node, answer, btn, list) {
    // Prevent double-click
    list.querySelectorAll('.option-btn').forEach(b => b.style.pointerEvents = 'none');
    btn.classList.add('selected');

    this.lastAnswer = answer;
    this.state.answers[node.id] = answer;

    setTimeout(() => {
      // Find decision node
      const decisionNode = Object.values(this.nodes).find(
        n => n.parentId === node.id && n.type === 'decision'
      );
      if (decisionNode) {
        this.advance(decisionNode.id);
      }
    }, 400);
  }

  showReflection(node, onContinue) {
    const text = this.interpolate(node.text);
    document.getElementById('reflection-text').textContent = text;
    document.getElementById('continue-btn').onclick = onContinue;
    this.showScreen('reflection-screen');
  }

  showBridge(node, onContinue) {
    const text      = this.interpolate(node.text);
    const bridgeNum = this.currentAxis; // which bridge
    document.getElementById('bridge-text').textContent = text;

    // Light up dots
    const dots = document.querySelectorAll('.bridge-dot');
    dots.forEach((d, i) => {
      d.classList.toggle('lit', i < bridgeNum);
    });

    document.getElementById('bridge-continue-btn').onclick = () => {
      this.currentAxis++;
      this.updateAxisPill();
      onContinue();
    };

    this.showScreen('bridge-screen');
  }

  showSummary(node) {
    const text = this.interpolate(node.text);
    document.getElementById('summary-synthesis-text').innerHTML =
      text.replace(/\b(internal|external|balanced|contribution|entitlement|altrocentric|self-centric)\b/gi,
        '<strong>$1</strong>');

    const a1 = this.getDominant('axis1');
    const a2 = this.getDominant('axis2');
    const a3 = this.getDominant('axis3');

    document.getElementById('result-axis1').textContent = a1;
    document.getElementById('result-axis2').textContent = a2;
    document.getElementById('result-axis3').textContent = a3;

    this.showScreen('summary-screen');

    // Stagger reveal animations
    setTimeout(() => {
      document.querySelectorAll('.axis-result-card').forEach((el, i) => {
        setTimeout(() => el.classList.add('revealed'), i * 220);
      });
      setTimeout(() => {
        document.getElementById('summary-end-btn').onclick = () => this.advance(node.target);
        document.getElementById('summary-synthesis').classList.add('revealed');
      }, 900);
    }, 400);
  }

  showEnd(node) {
    const text = this.interpolate(node.text);
    document.getElementById('end-text').textContent = text;
    this.showScreen('end-screen');
    document.querySelector('.progress-bar').style.width = '100%';
  }

  /* ── Helpers ─────────────────────────────────────────────── */
  updateProgress() {
    // Rough: count questions answered vs total
    const pct = Math.min(95, (this.questionCount / this.totalQuestions) * 90);
    document.getElementById('progress-bar').style.width = pct + '%';
  }

  updateAxis(nodeId) {
    // Determine which axis we're on from node prefix
    const pill1 = document.getElementById('axis-pill-1');
    const pill2 = document.getElementById('axis-pill-2');
    const pill3 = document.getElementById('axis-pill-3');

    pill1.classList.remove('active-1');
    pill2.classList.remove('active-2');
    pill3.classList.remove('active-3');

    if (nodeId.startsWith('A1')) {
      pill1.classList.add('active-1');
    } else if (nodeId.startsWith('A2')) {
      pill2.classList.add('active-2');
    } else if (nodeId.startsWith('A3')) {
      pill3.classList.add('active-3');
    }
  }

  updateAxisPill() {
    // After bridge, activate next axis pill
    const pills = [
      { el: 'axis-pill-1', cls: 'active-1' },
      { el: 'axis-pill-2', cls: 'active-2' },
      { el: 'axis-pill-3', cls: 'active-3' },
    ];
    if (this.currentAxis <= pills.length) {
      const { el, cls } = pills[this.currentAxis - 1];
      document.getElementById(el).classList.add(cls);
    }
  }

  getAxisLabel(nodeId) {
    if (nodeId.startsWith('A1')) return { label: 'Axis I · Locus of Control', color: 'var(--axis1)' };
    if (nodeId.startsWith('A2')) return { label: 'Axis II · Orientation', color: 'var(--amber)' };
    if (nodeId.startsWith('A3')) return { label: 'Axis III · Radius of Concern', color: 'var(--axis3)' };
    return { label: 'Reflection', color: 'var(--text-muted)' };
  }
}

/* ── Bootstrap ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const app = new ReflectionApp();
  app.init();
});
