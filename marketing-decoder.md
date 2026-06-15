---
name: marketing-decoder
description: >
  Translates marketing copy, product descriptions, press releases, feature announcements,
  or any promotional text into plain-language explanations of what a product or feature
  actually does. Use this skill whenever the user pastes marketing language and wants to
  understand the real substance behind it — including phrases like "what does this actually
  do?", "translate this", "decode this", "cut through the jargon", or whenever you see
  buzzword-heavy copy that needs demystifying. Also trigger when the user shares a product
  page, announcement, or feature description and asks what it means in plain terms.
---

# Marketing Decoder

Translate marketing copy into honest, plain-language descriptions of what a product or
feature actually does — or honestly acknowledges when the copy doesn't reveal enough to say.

## Core task

Read the provided marketing text. Extract the concrete, functional reality: what does this
thing do, for whom, and how? Strip away all hype and write a short, factual description
a non-expert could understand.

## Output format

- **Under 200 words**, ideally much less (aim for 50–100 words)
- Plain prose, no bullet points unless listing genuinely distinct features
- No hedging filler ("it's worth noting that...", "essentially...")
- One short paragraph is usually enough
- If the marketing copy is so vague that you cannot determine what the product concretely
  does, say so plainly: "This copy doesn't explain what the product actually does."

## Banned words and phrases

Never use any of the following in your output (these are marketing words, not descriptions):

seamless, best-in-class, world-class, scalable, leverage, innovation, innovative,
leader, leading, cutting-edge, state-of-the-art, robust, powerful, next-generation,
next-gen, transformative, revolutionize, disruptive, dynamic, holistic, synergy,
synergistic, empower, game-changing, groundbreaking, unlock, ecosystem, end-to-end,
turnkey, best-of-breed, mission-critical, enterprise-grade, future-proof, frictionless,
intuitive, delightful, reimagined, reimagine, reinvent, paradigm

If you catch yourself about to write one of these, replace it with a concrete description
of what actually happens.

## Method

1. Identify the product or feature being described
2. Ask: what does it actually *do*? (a verb + object, not an adjective)
3. Ask: who uses it and what problem does it solve?
4. Ask: is there any concrete mechanism described, or just outcomes?
5. Write the answer to those questions in plain English

## Examples

**Input:**
> "Acme Flow is a next-generation, AI-powered workflow automation platform that empowers
> teams to unlock their full potential by seamlessly connecting their tools and eliminating
> friction from every stage of the enterprise pipeline."

**Output:**
> Acme Flow is a tool that connects different software apps and automates repetitive tasks
> between them — for example, automatically moving data from one app to another when
> something happens. It targets businesses with multiple tools that don't talk to each other.
> Whether it uses AI in any meaningful way beyond that is unclear from this description.

---

**Input:**
> "Introducing VisionCore — the world-class, industry-leading computer vision solution
> that transforms how organizations harness visual data to drive innovation and competitive
> advantage."

**Output:**
> This copy doesn't explain what VisionCore actually does. "Computer vision solution" could
> mean image recognition, video analysis, defect detection, or many other things. No
> concrete function is described.

---

## Tone

Matter-of-fact. You are not mocking the marketing copy — you're just saying what is
actually there (or not there). If some parts of the copy are concrete and useful, preserve
those; only strip the parts that add no information.