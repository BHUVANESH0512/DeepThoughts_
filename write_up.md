# Design Rationale: The Daily Reflection Tree

**DT Fellowship Assessment · Part A Write-up**
**Word count: ~1,850 (under 2,000 limit)**

---

## Overview

The Daily Reflection Tree is a deterministic, psychologically-grounded conversational tool designed to surface self-awareness in employees at the end of a working day. It asks no open-ended questions, relies on no language model, and produces the same output for the same inputs every time. Its goal is not to give advice — it is to help someone see themselves more clearly.

The tree covers three psychological axes: **Locus of Control**, **Orientation** (contribution vs. entitlement), and **Radius of Concern** (self-centric vs. altrocentric). These are not arbitrary categories — they are grounded in peer-reviewed psychology and they chain logically: a person who feels agency (Axis I) naturally asks "what did I do with it?" (Axis II), which opens into "who was I doing it for?" (Axis III).

---

## Why These Three Axes

### Axis I: Locus of Control

**Psychological basis:** Rotter's (1966) locus of control refers to the degree to which people believe outcomes are determined by their own actions (internal) versus external factors such as luck, systems, or other people (external). Dweck's (2006) growth mindset research is a downstream application of the same construct: people who believe their abilities are malleable (internal locus) invest differently in their work than those who believe outcomes are fixed.

**Design rationale:** The first question does not ask "do you feel in control?" — that is too abstract and too leading. Instead, it asks for a single-word emotional summary of the day. This works because emotional tone is a reliable proximal signal for locus: a person who says "Frustrating" is likely narrating events that happened *to* them; a person who says "Productive" is likely narrating things they *did*. The follow-up questions then drill into the behavioural evidence to either confirm or disconfirm the hypothesis.

**Why fixed options:** Free text would produce uninterpretable signals. Fixed options let us design responses that genuinely distinguish the poles with precision — "I adapted quickly to change" vs. "Timing and luck aligned" is a meaningful distinction that free text rarely surfaces on its own.

### Axis II: Orientation (Contribution vs. Entitlement)

**Psychological basis:** Campbell et al. (2004) define psychological entitlement as "a stable belief that one deserves more and is entitled to more than others." Organ (1988) defines Organizational Citizenship Behaviour (OCB) as "discretionary effort beyond formal job requirements" — the direct opposite of entitlement in a workplace context. The axis asks: was I a net giver or net taker today?

**Design rationale:** This question is the most sensitive and the most likely to produce defensiveness. The options are written so that neither pole sounds overtly negative. "I was focused on recognition or resources" is honest and familiar — most people have felt this way. "I felt others weren't pulling their weight" is a real experience that frames a legitimate feeling, even if it signals an entitlement orientation. The reflection that follows does not shame — it reframes: "When we focus on what we deserve, we stop seeing what we can offer."

**Trade-off:** A single question per axis risks oversimplification. In a richer version of the tree, Axis II would include a second question: "Did you volunteer for something you didn't have to?" But for a 5-minute MVP, one clear probe is better than two ambiguous ones.

### Axis III: Radius of Concern (Self-centric vs. Altrocentric)

**Psychological basis:** Maslow's (1969) late-career work on self-transcendence identified it as the highest level of human motivation — a shift from meeting one's own needs to concern for others and for the collective. Batson's (2011) research on perspective-taking shows that actively imagining another person's experience increases prosocial behaviour. The axis captures where the employee's mind naturally goes.

**Design rationale:** The question — "When you think about today's biggest challenge or win, who comes to mind?" — does not ask who *should* come to mind. It asks who *does*. This distinction matters: the goal is accurate self-reporting, not virtuous performance. The options ("Just me," "My team," "A specific person," "The customer or mission") are ordered from narrowest to broadest concern deliberately, so the reflection for narrower answers can gently offer a wider frame without shaming.

---

## The Three-Axis Chain

The axes are not three independent quizzes bolted together. They are designed to build:

1. **Axis I** establishes whether the user sees themselves as an agent. If they do, the next question has traction.
2. **Axis II** asks what they did with that agency: did they invest it in others or hoard it for themselves?
3. **Axis III** asks how wide their care extended: was it about them, their team, or something larger?

This chain has psychological coherence. Research suggests internal locus of control predicts OCB (Axis I → Axis II connection). OCB, in turn, is associated with perspective-taking and concern for others (Axis II → Axis III connection). The tree follows this natural progression rather than treating each axis as isolated.

---

## Design Decisions and Trade-offs

### Determinism over Personalisation

**Decision:** Zero LLM calls at runtime. Same answers always produce the same reflection.

**Rationale:** Trustworthiness requires auditability. If a reflection is different every time, employees cannot trust that it is grounded in anything real. A deterministic tree is fully inspectable — anyone can read the JSON and trace any path. This also eliminates hallucination risk and API dependency.

**Trade-off:** The reflections cannot adapt to nuance within an answer. A user who says "Frustrating" because of a personal loss will get the same branching as one whose meeting ran long. A future version could add a follow-up: "Was the frustration about work, or something outside of it?"

### Tone as First Signal

**Decision:** The opening question ("How would you sum up today in one word?") uses emotional tone rather than direct introspection about control.

**Rationale:** At the end of a working day, employees are tired and often not in a reflective state. Asking "did you feel in control today?" is too direct and too likely to produce socially desirable answers. Emotional tone is harder to fake — a tired person will honestly say "Overwhelming." We infer the locus from that tone, then test it with behavioural follow-ups.

**Trade-off:** This means the tree has limited paths for nuanced emotional states. "Mixed" is the only middle option; there is no "Anxious" or "Excited." A richer first question with 6–8 options would improve coverage at the cost of longer decision trees.

### No Summary Feedback Loop

**Decision:** The summary shows the user's scores by axis but does not recommend actions.

**Rationale:** Unsolicited advice is often counterproductive. The tree's job is to help the user see — not to tell them what to do next. The reflection texts are already nudging gently. Ending with an action prescription would undermine the supportive, non-judgmental tone.

**Trade-off:** Users looking for concrete next steps will be disappointed. A future version could offer an optional "What's one thing you'd do differently tomorrow?" prompt after showing the summary.

---

## What to Improve with More Time

1. **More questions per axis.** Two questions per axis (vs. the 2–3 in the current MVP) would improve signal accuracy. Right now, Axis II has one question; it should have two.

2. **Better handling of mixed/balanced outcomes.** When the axes return "balanced," the summary is less meaningful. Balanced states should trigger a different branch that names the tension explicitly.

3. **Longitudinal tracking.** The most valuable version of this tool records responses over time and surfaces trends. "You've been External for three consecutive days" is more useful than a single-day snapshot.

4. **Accessibility and mobile polish.** The web UI works responsively, but the bridge transitions and animation timing could be improved for slower devices.

5. **Edge case reflection texts.** Several decision paths share the same reflection text via routing. More unique reflections — especially for the mixed/balanced persona — would improve the experience for users who don't fit the two poles cleanly.

---

## Sources

- Rotter, J. B. (1954). *Social learning and clinical psychology.* Prentice-Hall.
- Rotter, J. B. (1966). Generalized expectancies for internal versus external control of reinforcement. *Psychological Monographs*, 80(1).
- Dweck, C. S. (2006). *Mindset: The new psychology of success.* Random House.
- Campbell, W. K., et al. (2004). Psychological entitlement. *Personality and Social Psychology Bulletin*, 30(11), 1389–1401.
- Organ, D. W. (1988). *Organizational citizenship behavior.* Lexington Books.
- Maslow, A. H. (1969). Various meanings of transcendence. *Journal of Transpersonal Psychology*, 1(1), 56–66.
- Batson, C. D. (2011). *Altruism in humans.* Oxford University Press.
