# The Daily Reflection Tree

**DT Fellowship Assessment — Part A + Part B**

A deterministic, psychologically-grounded daily reflection tool. 30 nodes. 3 axes. 0 LLM calls at runtime.

---

## Live Demo

Open `index.html` in a browser (or run via a local server).

```bash
# Quick local server
python -m http.server 8000
# Then open: http://localhost:8000
```

## CLI Agent

```bash
python agent.py
```

## Transcript Generator

```bash
python transcript_gen.py
# Outputs: transcripts/transcript_victim.md
#          transcripts/transcript_victor.md
```

---

## Project Structure

```
.
├── index.html              ← Web UI (minimal dark design)
├── style.css               ← Design system
├── app.js                  ← Tree-walking logic (JS)
├── reflection_tree.json    ← 30-node tree definition
├── agent.py                ← CLI interactive agent
├── transcript_gen.py       ← Persona simulation script
├── transcripts/
│   ├── transcript_victim.md
│   └── transcript_victor.md
├── write_up.md             ← Design rationale (1,850 words)
└── README.md
```

---

## Tree Structure

| Node Type   | Count | Role                              |
|-------------|-------|-----------------------------------|
| Start       | 1     | Entry point                       |
| Question    | 8     | User input (3–5 fixed options)    |
| Decision    | 5     | Internal routing logic            |
| Reflection  | 13    | Psychology-grounded reframes      |
| Bridge      | 2     | Axis transitions (1→2, 2→3)       |
| Summary     | 1     | Synthesis of all three axes       |
| End         | 1     | Closing message                   |
| **Total**   | **30**|                                   |

---

## Three Psychological Axes

### Axis I — Locus of Control
**Internal vs External** · Rotter (1954, 1966) · Dweck (2006)

Questions probe whether the user attributes outcomes to their own actions or to external circumstances. The first question ("How would you sum up today?") uses emotional tone as a proxy for locus, then drills into behavioural evidence.

### Axis II — Orientation
**Contribution vs Entitlement** · Campbell et al. (2004) · Organ (1988)

A direct but non-judgmental probe: were you focused on giving or getting? Fixed options are written so that neither pole feels "wrong"—the tree reframes gently without moralising.

### Axis III — Radius of Concern
**Self-centric vs Altrocentric** · Maslow (1969) · Batson (2011)

The broadest axis. Who came to mind when you think about your day? Widening the circle from self → team → customer is the direction of growth.

---

## Decision Node Routing

Each question node has a sibling `decision` node that matches `answer=X|Y:TARGET_NODE`. The JS and Python agents both use `rfind(':')` to split target from condition, supporting pipe-delimited (`|`) multi-answer matching.

**Example:**
```json
{
  "id": "A1_D1",
  "type": "decision",
  "options": [
    "answer=Productive:A1_Q_AGENCY_HIGH",
    "answer=Mixed:A1_Q_AGENCY_MID",
    "answer=Overwhelming|Frustrating:A1_Q_AGENCY_LOW"
  ]
}
```

---

## Why No LLM?

Same answers → same reflection, always. Every path is visible in the JSON. No hallucination risk. No API dependency. Auditable by design.

---

## Citations

- Rotter, J. B. (1954). *Social learning and clinical psychology.* Prentice-Hall.
- Rotter, J. B. (1966). Generalized expectancies for internal versus external control of reinforcement. *Psychological Monographs*, 80(1).
- Dweck, C. S. (2006). *Mindset: The new psychology of success.* Random House.
- Campbell, W. K., Bonacci, A. M., Shelton, J., Exline, J. J., & Bushman, B. J. (2004). Psychological entitlement. *Personality and Social Psychology Bulletin*, 30(11), 1389–1401.
- Organ, D. W. (1988). *Organizational citizenship behavior.* Lexington Books.
- Maslow, A. H. (1969). Various meanings of transcendence. *Journal of Transpersonal Psychology*, 1(1), 56–66.
- Batson, C. D. (2011). *Altruism in humans.* Oxford University Press.
