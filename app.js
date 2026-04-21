/**
 * Daily Reflection Tree — App Logic
 * Pure deterministic tree walking. No LLM. No backend.
 */

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
    this.totalQuestions = 4; // approx questions in a path
    this.currentAxis = 1;
  }

  /* ── Bootstrap ─────────────────────────────────────────── */
  async init() {
    try {
      const res    = await fetch('./reflection_tree.json');
      this.treeData = await res.json();
      this.nodes   = {};
      for (const n of this.treeData.nodes) {
        this.nodes[n.id] = n;
      }
      this.bindUI();
      this.updateClock();
      setInterval(() => this.updateClock(), 60000);
    } catch (e) {
      console.error('Failed to load tree:', e);
      alert('Could not load reflection_tree.json. Please run via a local server.');
    }
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
