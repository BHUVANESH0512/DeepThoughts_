/**
 * Daily Reflection Tree — App Logic
 * Deterministic tree walk across 3 psychological axes.
 * Supports: decision routing, direct-target routing, question-level signals.
 */

/* ── Tree Data (inlined — works from file:// without a server) ─ */
const TREE_DATA = {"metadata":{"title":"The Daily Reflection Tree","version":"3.0","description":"A deterministic end-of-day reflection across Locus of Control, Orientation, and Radius of Concern.","axes":["Axis 1: Locus of Control (Internal vs External)","Axis 2: Orientation (Contribution vs Entitlement vs Neutral)","Axis 3: Radius of Concern (Self → Team → Others → Wide)"]},"nodes":[

  {"id":"START","parentId":null,"type":"start","text":"Good evening. Let's take a moment to look at your day — not just what happened, but how you showed up.","options":[],"target":"A1_OPEN","signal":null},

  {"id":"A1_OPEN","parentId":"START","type":"question","text":"How would you sum up your day in one word?","options":["Productive","Overwhelming","Mixed","Frustrating"],"target":null,"signal":null},
  {"id":"A1_D1","parentId":"A1_OPEN","type":"decision","text":"","options":["answer=Productive|Mixed:A1_Q1_HIGH","answer=Overwhelming|Frustrating:A1_Q1_LOW"],"target":null,"signal":null},

  {"id":"A1_Q1_HIGH","parentId":"A1_D1","type":"question","text":"You said \"{A1_OPEN.answer}\". What do you think made things go well?","options":["My preparation","Clear priorities","Team support","I adjusted as things changed"],"target":null,"signal":null},
  {"id":"A1_Q1_LOW","parentId":"A1_D1","type":"question","text":"You said \"{A1_OPEN.answer}\". When things got difficult, what was your first move?","options":["Tried to control what I could","Waited for direction","Felt stuck","Blamed the situation"],"target":null,"signal":null},

  {"id":"A1_D2_HIGH","parentId":"A1_Q1_HIGH","type":"decision","text":"","options":["answer=My preparation|Clear priorities|I adjusted as things changed:A1_Q2_INTERNAL","answer=Team support:A1_Q2_MIXED"],"target":null,"signal":null},
  {"id":"A1_D2_LOW","parentId":"A1_Q1_LOW","type":"decision","text":"","options":["answer=Tried to control what I could:A1_Q2_INTERNAL","answer=Waited for direction|Felt stuck|Blamed the situation:A1_Q2_EXTERNAL"],"target":null,"signal":null},

  {"id":"A1_Q2_INTERNAL","parentId":"A1_D2_HIGH","type":"question","text":"When something unexpected happened, how did you respond?","options":["Took initiative quickly","Adjusted plan calmly","Asked for input then acted","Stayed consistent"],"target":"A1_Q3_INT","signal":"axis1:internal"},
  {"id":"A1_Q2_MIXED","parentId":"A1_D2_HIGH","type":"question","text":"How dependent was your progress on others today?","options":["Mostly me","Balanced effort","Mostly others","Couldn't move without others"],"target":"A1_Q3_INT","signal":"axis1:mixed"},
  {"id":"A1_Q2_EXTERNAL","parentId":"A1_D2_LOW","type":"question","text":"When facing a setback, what held you back most?","options":["Lack of clarity","Dependence on others","Low energy","Uncertainty"],"target":"A1_Q3_EXT","signal":"axis1:external"},

  {"id":"A1_Q3_INT","parentId":"A1_Q2_INTERNAL","type":"question","text":"Looking back, where did you have the most control?","options":["My actions","My mindset","My decisions","My preparation"],"target":"A1_R_INT","signal":"axis1:internal"},
  {"id":"A1_Q3_EXT","parentId":"A1_Q2_EXTERNAL","type":"question","text":"Looking back, was there a moment you could have acted differently?","options":["Yes, small action possible","Maybe, not sure","No control at all","Didn't think about it"],"target":"A1_R_EXT","signal":"axis1:external"},

  {"id":"A1_R_INT","parentId":"A1_Q3_INT","type":"reflection","text":"You consistently looked for what was within your control. That's not about perfection — it's about staying engaged with your role in outcomes.","options":[],"target":"BRIDGE_1_2","signal":"axis1:internal"},
  {"id":"A1_R_EXT","parentId":"A1_Q3_EXT","type":"reflection","text":"Some situations felt outside your control. Still, even small choices often exist — noticing them is where agency begins.","options":[],"target":"BRIDGE_1_2B","signal":"axis1:external"},

  {"id":"BRIDGE_1_2","parentId":"A1_R_INT","type":"bridge","text":"Now let's shift the lens — from control to contribution.","options":[],"target":"A2_OPEN","signal":null},
  {"id":"BRIDGE_1_2B","parentId":"A1_R_EXT","type":"bridge","text":"Now let's shift the lens — from control to contribution.","options":[],"target":"A2_OPEN","signal":null},

  {"id":"A2_OPEN","parentId":null,"type":"question","text":"Think of one interaction today. What were you focused on?","options":["Helping someone","Doing my work","Getting recognition","Noticing others' gaps"],"target":null,"signal":null},
  {"id":"A2_D1","parentId":"A2_OPEN","type":"decision","text":"","options":["answer=Helping someone:A2_Q1_CONTRIB","answer=Doing my work:A2_Q1_NEUTRAL","answer=Getting recognition|Noticing others' gaps:A2_Q1_ENTITLE"],"target":null,"signal":null},

  {"id":"A2_Q1_CONTRIB","parentId":"A2_D1","type":"question","text":"What kind of contribution did you make?","options":["Solved someone's problem","Shared knowledge","Took initiative","Supported quietly"],"target":null,"signal":"axis2:contribution"},
  {"id":"A2_Q1_NEUTRAL","parentId":"A2_D1","type":"question","text":"How would you describe your effort?","options":["Met expectations","Stayed consistent","Avoided extra work","Focused on own tasks"],"target":"A2_R_NEUTRAL","signal":"axis2:neutral"},
  {"id":"A2_Q1_ENTITLE","parentId":"A2_D1","type":"question","text":"What stood out most in your thinking?","options":["I deserved more credit","Others should improve","I wasn't supported enough","My effort wasn't seen"],"target":null,"signal":"axis2:entitlement"},

  {"id":"A2_D2_CONTRIB","parentId":"A2_Q1_CONTRIB","type":"decision","text":"","options":["answer=Supported quietly:A2_Q2_DEEP","answer=Solved someone's problem|Shared knowledge|Took initiative:A2_Q2_ACTIVE"],"target":null,"signal":null},
  {"id":"A2_D2_ENTITLE","parentId":"A2_Q1_ENTITLE","type":"decision","text":"","options":["answer=I deserved more credit|My effort wasn't seen:A2_Q2_RECOG","answer=Others should improve|I wasn't supported enough:A2_Q2_BLAME"],"target":null,"signal":null},

  {"id":"A2_Q2_ACTIVE","parentId":"A2_D2_CONTRIB","type":"question","text":"What motivated your action?","options":["It felt right","Team success mattered","Habit","Opportunity"],"target":"A2_R_CONTRIB","signal":"axis2:contribution"},
  {"id":"A2_Q2_DEEP","parentId":"A2_D2_CONTRIB","type":"question","text":"Why didn't you highlight your contribution?","options":["Didn't feel necessary","Didn't think about it","Avoided attention","Unsure of value"],"target":"A2_R_CONTRIB","signal":"axis2:contribution"},
  {"id":"A2_Q2_RECOG","parentId":"A2_D2_ENTITLE","type":"question","text":"What mattered most to you in that moment?","options":["Being recognized","Fairness","Validation","Outcome"],"target":"A2_R_ENTITLE","signal":"axis2:entitlement"},
  {"id":"A2_Q2_BLAME","parentId":"A2_D2_ENTITLE","type":"question","text":"What frustrated you most?","options":["Others' effort","Lack of support","Misalignment","Unclear roles"],"target":"A2_R_ENTITLE","signal":"axis2:entitlement"},

  {"id":"A2_R_CONTRIB","parentId":"A2_Q2_ACTIVE","type":"reflection","text":"You leaned toward contribution — acting beyond obligation. This builds trust even when it goes unnoticed.","options":[],"target":"BRIDGE_2_3","signal":"axis2:contribution"},
  {"id":"A2_R_NEUTRAL","parentId":"A2_Q1_NEUTRAL","type":"reflection","text":"You stayed within your lane. Stability matters, but growth often begins just beyond it.","options":[],"target":"BRIDGE_2_3B","signal":"axis2:neutral"},
  {"id":"A2_R_ENTITLE","parentId":"A2_Q2_RECOG","type":"reflection","text":"It's natural to want fairness and recognition. Still, contribution tends to create the conditions for both.","options":[],"target":"BRIDGE_2_3C","signal":"axis2:entitlement"},

  {"id":"BRIDGE_2_3","parentId":"A2_R_CONTRIB","type":"bridge","text":"One last layer — zooming out beyond you.","options":[],"target":"A3_OPEN","signal":null},
  {"id":"BRIDGE_2_3B","parentId":"A2_R_NEUTRAL","type":"bridge","text":"One last layer — zooming out beyond you.","options":[],"target":"A3_OPEN","signal":null},
  {"id":"BRIDGE_2_3C","parentId":"A2_R_ENTITLE","type":"bridge","text":"One last layer — zooming out beyond you.","options":[],"target":"A3_OPEN","signal":null},

  {"id":"A3_OPEN","parentId":null,"type":"question","text":"When you think about today, who comes to mind first?","options":["Just me","My team","A colleague","The end user"],"target":null,"signal":null},
  {"id":"A3_D1","parentId":"A3_OPEN","type":"decision","text":"","options":["answer=Just me:A3_Q1_SELF","answer=My team:A3_Q1_TEAM","answer=A colleague:A3_Q1_OTHER","answer=The end user:A3_Q1_WIDE"],"target":null,"signal":null},

  {"id":"A3_Q1_SELF","parentId":"A3_D1","type":"question","text":"What was your main focus?","options":["My workload","My stress","My deadlines","My performance"],"target":"A3_Q2_SELF","signal":"axis3:self"},
  {"id":"A3_Q1_TEAM","parentId":"A3_D1","type":"question","text":"How did your team shape your day?","options":["Collaboration","Shared stress","Dependency","Support"],"target":"A3_R_TEAM","signal":"axis3:team"},
  {"id":"A3_Q1_OTHER","parentId":"A3_D1","type":"question","text":"What stood out about others?","options":["Someone struggled","Someone needed help","Someone succeeded","Someone supported me"],"target":"A3_R_OTHERS","signal":"axis3:others"},
  {"id":"A3_Q1_WIDE","parentId":"A3_D1","type":"question","text":"How did your work connect to a larger outcome?","options":["Customer value","Team success","Long-term impact","Problem solved"],"target":"A3_Q2_WIDE","signal":"axis3:wide"},

  {"id":"A3_Q2_SELF","parentId":"A3_Q1_SELF","type":"question","text":"Did you consider how your actions affected others?","options":["Not really","A little","Sometimes","Often"],"target":"A3_R_SELF","signal":"axis3:self"},
  {"id":"A3_Q2_WIDE","parentId":"A3_Q1_WIDE","type":"question","text":"Did this perspective influence your actions?","options":["Yes clearly","Somewhat","Not much","Not at all"],"target":"A3_R_WIDE","signal":"axis3:wide"},

  {"id":"A3_R_SELF","parentId":"A3_Q2_SELF","type":"reflection","text":"Your focus stayed close to your own experience. Expanding that lens can often reduce pressure and bring clarity.","options":[],"target":"SUMMARY","signal":"axis3:self"},
  {"id":"A3_R_TEAM","parentId":"A3_Q1_TEAM","type":"reflection","text":"You saw your day through the team. Shared context often brings better decisions.","options":[],"target":"SUMMARY","signal":"axis3:team"},
  {"id":"A3_R_OTHERS","parentId":"A3_Q1_OTHER","type":"reflection","text":"You noticed others — that awareness is where stronger collaboration begins.","options":[],"target":"SUMMARY","signal":"axis3:others"},
  {"id":"A3_R_WIDE","parentId":"A3_Q2_WIDE","type":"reflection","text":"You connected your work to something larger. That's where meaning tends to grow.","options":[],"target":"SUMMARY","signal":"axis3:wide"},

  {"id":"SUMMARY","parentId":null,"type":"summary","text":"Today you leaned {axis1.dominant} in ownership, {axis2.dominant} in contribution, and {axis3.dominant} in perspective. Notice one small shift for tomorrow.","options":[],"target":"END","signal":null},
  {"id":"END","parentId":"SUMMARY","type":"end","text":"That's your reflection for today. See you tomorrow.","options":[],"target":null,"signal":null}

]};

/* ═══════════════════════════════════════════════════════════════
   ReflectionApp
═══════════════════════════════════════════════════════════════ */
class ReflectionApp {
  constructor() {
    this.nodes          = {};
    this.state          = this._freshState();
    this.lastAnswer     = null;
    this.questionCount  = 0;
    this.totalQuestions = 10; // max questions in any session path
    this.currentAxis    = 1;
  }

  _freshState() {
    return {
      answers: {},
      axis1: { internal: 0, external: 0, mixed: 0 },
      axis2: { contribution: 0, entitlement: 0, neutral: 0 },
      axis3: { self: 0, team: 0, others: 0, wide: 0 },
    };
  }

  /* ── Bootstrap ──────────────────────────────────────────── */
  init() {
    for (const n of TREE_DATA.nodes) this.nodes[n.id] = n;
    this.bindUI();
    this.updateClock();
    setInterval(() => this.updateClock(), 60000);
  }

  updateClock() {
    const now = new Date();
    const el  = document.getElementById('header-time');
    if (el) el.textContent =
      `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
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
    document.querySelector('.progress-bar-wrap').classList.add('visible');
    document.querySelector('.axis-indicators').classList.add('visible');
    this.advance('START');
  }

  restartSession() {
    this.state         = this._freshState();
    this.lastAnswer    = null;
    this.questionCount = 0;
    this.currentAxis   = 1;

    ['axis-pill-1','axis-pill-2','axis-pill-3'].forEach(id => {
      document.getElementById(id).classList.remove('active-1','active-2','active-3');
    });
    document.getElementById('progress-bar').style.width = '0%';
    document.querySelectorAll('.axis-result-card').forEach(el => el.classList.remove('revealed'));
    document.getElementById('summary-synthesis').classList.remove('revealed');

    this.showScreen('welcome-screen');
    document.querySelector('.progress-bar-wrap').classList.remove('visible');
    document.querySelector('.axis-indicators').classList.remove('visible');
  }

  /* ── Core tree walk ─────────────────────────────────────── */
  advance(nodeId) {
    const node = this.nodes[nodeId];
    if (!node) { console.error('Node not found:', nodeId); return; }

    switch (node.type) {

      case 'start':
        this.advance(node.target);
        break;

      case 'question':
        // Process axis signal when entering a question node
        if (node.signal) this.processSignal(node.signal);
        this.showQuestion(node);
        break;

      case 'decision':
        const next = this.routeDecision(node, this.lastAnswer);
        if (next) this.advance(next);
        else console.warn('No route for answer:', this.lastAnswer, 'node:', nodeId);
        break;

      case 'reflection':
        if (node.signal) this.processSignal(node.signal);
        this.showReflection(node, () => this.advance(node.target));
        break;

      case 'bridge':
        this.showBridge(node, () => this.advance(node.target));
        break;

      case 'summary':
        this.showSummary(node);
        break;

      case 'end':
        this.showEnd(node);
        break;
    }
  }

  /* ── Decision routing ───────────────────────────────────── */
  routeDecision(node, answer) {
    if (!answer) return null;
    for (const rule of node.options) {
      // Format: "answer=Opt1|Opt2:TARGET_NODE_ID"
      const lastColon = rule.lastIndexOf(':');
      if (lastColon === -1) continue;
      const condPart = rule.substring(0, lastColon);
      const target   = rule.substring(lastColon + 1);
      if (condPart.startsWith('answer=')) {
        const valid = condPart.slice(7).split('|');
        if (valid.includes(answer)) return target;
      }
    }
    return null;
  }

  /* ── Signal accumulation ────────────────────────────────── */
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
      const max = Math.max(a.internal, a.external, a.mixed);
      if (max === 0) return 'balanced';
      if (a.internal === max) return 'internal';
      if (a.external === max) return 'external';
      return 'shared';  // mixed
    }

    if (axisName === 'axis2') {
      const max = Math.max(a.contribution, a.entitlement, a.neutral);
      if (max === 0 || a.neutral === max) return 'neutral';
      if (a.contribution === max) return 'contribution';
      return 'entitlement';
    }

    if (axisName === 'axis3') {
      const max = Math.max(a.self, a.team, a.others, a.wide);
      if (max === 0 || a.self === max) return 'self-focused';
      if (a.wide === max)   return 'mission-wide';
      if (a.others === max) return 'others-aware';
      return 'team-oriented';
    }

    return 'balanced';
  }

  /* ── Text interpolation ─────────────────────────────────── */
  interpolate(text) {
    let out = text;
    for (const [id, ans] of Object.entries(this.state.answers)) {
      out = out.replaceAll(`{${id}.answer}`, ans);
    }
    out = out.replaceAll('{axis1.dominant}', this.getDominant('axis1'));
    out = out.replaceAll('{axis2.dominant}', this.getDominant('axis2'));
    out = out.replaceAll('{axis3.dominant}', this.getDominant('axis3'));
    return out;
  }

  /* ── Screen transitions ─────────────────────────────────── */
  showScreen(id) {
    const next    = document.getElementById(id);
    const current = document.querySelector('.screen.active');
    if (!next) return;

    // Same screen: restart animation
    if (!current || current === next) {
      if (current) { current.classList.remove('active'); void current.offsetWidth; }
      next.classList.add('active');
      return;
    }

    // Different screen: animate out → activate next
    current.classList.add('leaving');
    setTimeout(() => {
      current.classList.remove('active', 'leaving');
      next.classList.add('active');
    }, 260);
  }

  /* ── Question renderer ──────────────────────────────────── */
  showQuestion(node) {
    this.questionCount++;
    this.updateAxis(node.id);
    this.updateProgress();

    const axisLabel = this.getAxisLabel(node.id);
    document.getElementById('q-axis-label').textContent = axisLabel.label;
    document.getElementById('q-axis-label').style.color = axisLabel.color;
    document.getElementById('question-text').textContent = this.interpolate(node.text);

    const list = document.getElementById('options-list');
    list.innerHTML = '';
    node.options.forEach((opt, i) => {
      const btn     = document.createElement('button');
      btn.className = 'option-btn';
      btn.id        = `option-${i + 1}`;
      btn.setAttribute('role', 'listitem');
      btn.innerHTML = `<span class="option-num">${i + 1}</span><span class="option-text">${opt}</span>`;
      btn.addEventListener('click', () => this.selectOption(node, opt, btn, list));
      list.appendChild(btn);
    });

    this.showScreen('question-screen');
  }

  /* ── Option selection: two routing strategies ───────────── */
  selectOption(node, answer, btn, list) {
    // Lock all options immediately
    list.querySelectorAll('.option-btn').forEach(b => b.style.pointerEvents = 'none');
    btn.classList.add('selected');

    this.lastAnswer = answer;
    this.state.answers[node.id] = answer;

    setTimeout(() => {
      // Strategy 1: decision child exists → route via its rules
      const decisionNode = Object.values(this.nodes).find(
        n => n.parentId === node.id && n.type === 'decision'
      );
      if (decisionNode) {
        this.advance(decisionNode.id);
        return;
      }

      // Strategy 2: question has an explicit target → go directly
      if (node.target) {
        this.advance(node.target);
        return;
      }

      console.error('No routing path found for question:', node.id);
    }, 380);
  }

  /* ── Reflection renderer ────────────────────────────────── */
  showReflection(node, onContinue) {
    document.getElementById('reflection-text').textContent = this.interpolate(node.text);
    document.getElementById('continue-btn').onclick = onContinue;
    this.showScreen('reflection-screen');
  }

  /* ── Bridge renderer ────────────────────────────────────── */
  showBridge(node, onContinue) {
    document.getElementById('bridge-text').textContent = this.interpolate(node.text);

    const dots = document.querySelectorAll('.bridge-dot');
    dots.forEach((d, i) => d.classList.toggle('lit', i < this.currentAxis));

    document.getElementById('bridge-continue-btn').onclick = () => {
      this.currentAxis++;
      this.updateAxisPill();
      onContinue();
    };

    this.showScreen('bridge-screen');
  }

  /* ── Summary renderer ───────────────────────────────────── */
  showSummary(node) {
    const text = this.interpolate(node.text);
    document.getElementById('summary-synthesis-text').innerHTML =
      text.replace(/\b(internal|external|shared|balanced|contribution|entitlement|neutral|self-focused|team-oriented|others-aware|mission-wide)\b/gi,
        '<strong>$1</strong>');

    document.getElementById('result-axis1').textContent = this.getDominant('axis1');
    document.getElementById('result-axis2').textContent = this.getDominant('axis2');
    document.getElementById('result-axis3').textContent = this.getDominant('axis3');

    this.showScreen('summary-screen');

    // Stagger reveal
    setTimeout(() => {
      document.querySelectorAll('.axis-result-card').forEach((el, i) => {
        setTimeout(() => el.classList.add('revealed'), i * 200);
      });
      setTimeout(() => {
        document.getElementById('summary-end-btn').onclick = () => this.advance(node.target);
        document.getElementById('summary-synthesis').classList.add('revealed');
      }, 850);
    }, 350);
  }

  /* ── End renderer ───────────────────────────────────────── */
  showEnd(node) {
    document.getElementById('end-text').textContent = this.interpolate(node.text);
    this.showScreen('end-screen');
    document.getElementById('progress-bar').style.width = '100%';
  }

  /* ── Helpers ─────────────────────────────────────────────── */
  updateProgress() {
    const pct = Math.min(96, (this.questionCount / this.totalQuestions) * 90);
    document.getElementById('progress-bar').style.width = pct + '%';
  }

  updateAxis(nodeId) {
    document.getElementById('axis-pill-1').classList.remove('active-1');
    document.getElementById('axis-pill-2').classList.remove('active-2');
    document.getElementById('axis-pill-3').classList.remove('active-3');
    if      (nodeId.startsWith('A1')) document.getElementById('axis-pill-1').classList.add('active-1');
    else if (nodeId.startsWith('A2')) document.getElementById('axis-pill-2').classList.add('active-2');
    else if (nodeId.startsWith('A3')) document.getElementById('axis-pill-3').classList.add('active-3');
  }

  updateAxisPill() {
    const map = [
      { el: 'axis-pill-1', cls: 'active-1' },
      { el: 'axis-pill-2', cls: 'active-2' },
      { el: 'axis-pill-3', cls: 'active-3' },
    ];
    if (this.currentAxis <= map.length) {
      const { el, cls } = map[this.currentAxis - 1];
      document.getElementById(el).classList.add(cls);
    }
  }

  getAxisLabel(nodeId) {
    if (nodeId.startsWith('A1')) return { label: 'Axis I · Locus of Control',   color: 'var(--axis1)' };
    if (nodeId.startsWith('A2')) return { label: 'Axis II · Orientation',        color: 'var(--axis2)' };
    if (nodeId.startsWith('A3')) return { label: 'Axis III · Radius of Concern', color: 'var(--axis3)' };
    return { label: 'Reflection', color: 'var(--text-muted)' };
  }
}

/* ── Bootstrap ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => new ReflectionApp().init());
