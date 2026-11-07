// revamp/tools/section-refs.mjs: find the in-dive "section N" references of a section file.
//
// Shared by renumber.mjs (rewrites the numbers through an old-to-new map) and
// check-renumber.mjs (confirms each number points to the section its sentence means).
//
// A reference is "section N", "Section N", "sections N to M", "sections N, M and P" and
// the like. Matches that point into a cited paper, not into this dive, are skipped:
//   1. anything inside <Cite ...>...</Cite>;
//   2. anything inside a local wrapper component that renders a Cite (for example
//      <Ace>ACE, Section 2</Ace>), detected from the file itself;
//   3. a capitalised "Section" right after ", " (a paper location such as
//      "DeepSeek-R1, Section 2.2" in a citation label string);
//   4. a number followed by ".digit" (a paper subsection such as 5.3);
//   5. a number after "SCOPE.md " or "GUIDE.md " (a planning-document section);
//   6. a section of another dive: "vLLM dive, section 6", "the training dive's section 16".

/** The dive's sections before the fine-tuning rebuild (24) mapped to their new numbers (27). */
export const OLD_TO_NEW = {
  1: 1, 2: 2, 3: 5, 4: 6, 5: 7, 6: 8, 7: 9, 8: 10, 9: 12, 10: 13, 11: 14, 12: 15,
  13: 16, 14: 17, 15: 18, 16: 19, 17: 20, 18: 21, 19: 22, 20: 23, 21: 24, 22: 25, 23: 26, 24: 27,
};

/** Spans [start, end) of the text that holds citation labels rather than prose. */
export function skipSpans(src) {
  const spans = [];
  for (const m of src.matchAll(/<Cite\b[\s\S]*?<\/Cite>/g)) spans.push([m.index, m.index + m[0].length]);
  // Local components whose body renders a Cite: <Name>...</Name> holds a citation label.
  const wrappers = new Set();
  for (const m of src.matchAll(/\nfunction ([A-Z]\w*)\(\{ children[\s\S]*?\n\}\n/g)) {
    if (m[0].includes('<Cite')) wrappers.add(m[1]);
  }
  for (const name of wrappers) {
    const re = new RegExp(`<${name}\\b[^>]*>[\\s\\S]*?</${name}>`, 'g');
    for (const m of src.matchAll(re)) spans.push([m.index, m.index + m[0].length]);
  }
  return spans;
}

const NUM = String.raw`\d+(?!\.\d)`;
const SEP = String.raw`(?:\s*,\s*and\s+|\s*,\s*|\s+and\s+|\s+to\s+|\s+or\s+)`;
/** "section 8", "sections 3 to 10", "sections 13, 14 and 18". Group 1 = word, group 2 = number list. */
export const REF_RE = new RegExp(String.raw`\b([Ss]ections?)\s+(${NUM}(?:${SEP}${NUM})*)`, 'g');

/**
 * Every reference in src: { index, length, word, numbers: [{ value, index }], skipped, reason }.
 * Number indexes are absolute offsets into src.
 */
export function findRefs(src) {
  const spans = skipSpans(src);
  const inSpan = (i) => spans.some(([a, b]) => i >= a && i < b);
  const refs = [];
  for (const m of src.matchAll(REF_RE)) {
    const word = m[1];
    const listStart = m.index + m[0].indexOf(m[2], word.length);
    const numbers = [];
    for (const n of m[2].matchAll(/\d+/g)) numbers.push({ value: Number(n[0]), index: listStart + n.index });
    let reason = null;
    const before = src.slice(Math.max(0, m.index - 24), m.index);
    if (inSpan(m.index)) reason = 'citation label';
    else if (/^S/.test(word) && /,\s$/.test(before)) reason = 'paper location after a comma';
    else if (/(SCOPE|GUIDE)\.md\s$/.test(before)) reason = 'planning-document section';
    else if (/dives?(?:'s|&apos;s)?,?\s+$/.test(before)) reason = "another dive's section";
    refs.push({ index: m.index, length: m[0].length, word, numbers, skipped: reason !== null, reason });
  }
  return refs;
}

/** 1-based line number of an offset. */
export function lineOf(src, index) {
  let line = 1;
  for (let i = 0; i < index; i++) if (src.charCodeAt(i) === 10) line++;
  return line;
}

/** The sentence around an offset, with JSX tags, braces and entities flattened, for review. */
export function sentenceAt(src, index) {
  const lo = Math.max(0, index - 400);
  const hi = Math.min(src.length, index + 400);
  const raw = src.slice(lo, hi);
  const at = index - lo;
  const flat = (s) =>
    s
      .replace(/<Cite\b[\s\S]*?<\/Cite>/g, ' [cite] ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\{' '\}/g, ' ')
      .replace(/&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ');
  const left = flat(raw.slice(0, at));
  const right = flat(raw.slice(at));
  const startCut = Math.max(left.lastIndexOf('. '), left.lastIndexOf('>'), left.lastIndexOf("'"), -1);
  const endMatch = right.search(/\.\s|\.$|',|'\]/);
  const s = left.slice(startCut + 1) + (endMatch >= 0 ? right.slice(0, endMatch + 1) : right);
  return s.trim();
}
