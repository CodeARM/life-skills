# Complete Sentences Rewriter

## Purpose
Rewrite articles written in punchy, fragmentary style into prose with complete sentences, without losing any meaning.

## The Problem Pattern
Fragmented writing looks like this:
- Sentence fragments used as standalone sentences. ("Not good.")
- Artificial urgency via short stabs. ("It's time. Now.")
- Dramatic one-word emphasis lines. ("Revolutionary.")
- Incomplete thoughts strung together. ("Because reasons.")

## Transformation Rules
1. **Merge fragments** into the nearest logical sentence. "It's simple. Easy, even. Anyone can do it." → "It's simple enough that anyone can do it."
2. **Complete dangling clauses.** "Because the market changed." → "This happened because the market changed."
3. **Flatten dramatic stacking.** A sequence of 3-word punches should become one or two full sentences.
4. **Preserve all meaning and facts.** Do not drop information, soften claims, or change the author's position — only fix the grammar and flow.
5. **Keep the voice where possible.** If the author is opinionated or informal, that's fine — complete sentences don't mean stiff sentences.
6. **Do not over-expand.** The goal is complete sentences, not padding. A tight paragraph is better than a bloated one.

## Example

**Input:**
> Not the beginning. The end. Of words. I don't complete sentences. Sentences suck. I'm urgent. Blerg blat.

**Output:**
> This isn't the beginning — it's the end of words. I don't complete my sentences because I think urgency requires brevity, but it just produces blerg blat.

## Output Format
Return the rewritten article only. No commentary, no markup, no explanation — just the cleaned-up prose.