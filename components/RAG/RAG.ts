/**
 * rag.ts — Mani RAG Utility
 * Lightweight TF-IDF semantic search over the RSMK knowledge base.
 */

import knowledgeBase from './knowledge-base.json';

// ─── TF-IDF Engine ────────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with',
  'is','are','was','were','be','been','has','have','had','do','does','did',
  'will','would','could','should','may','might','can','its','it','this',
  'that','these','those','i','you','he','she','we','they','what','how',
  'when','where','who','which','my','your','his','her','our','their','me',
  'him','us','them','about','as','by','from','into','through','than','more',
  'also','just','not','so','if','up','out','all','any','some','no','yes'
]);

function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w: string) => w.length > 2 && !STOP_WORDS.has(w));
}

function buildIndex(chunks: any[]) {
  const index = {
    df: {} as Record<string, number>,
    chunks: [] as any[],
    totalDocs: chunks.length
  };

  for (const chunk of chunks) {
    const text = `${chunk.title} ${chunk.title} ${chunk.title} ${chunk.content}`;
    const tokens = tokenise(text);
    const tf: Record<string, number> = {};
    for (const t of tokens) {
      tf[t] = (tf[t] || 0) + 1;
    }
    const len = tokens.length || 1;
    for (const t in tf) tf[t] /= len;

    index.chunks.push({ ...chunk, tf, tokens });
  }

  for (const chunk of index.chunks) {
    for (const t in chunk.tf) {
      index.df[t] = (index.df[t] || 0) + 1;
    }
  }

  return index;
}

function tfidfScore(queryTokens: string[], chunk: any, index: any): number {
  let score = 0;
  const N = index.totalDocs;

  for (const t of queryTokens) {
    if (!chunk.tf[t]) continue;
    const idf = Math.log((N + 1) / ((index.df[t] || 0) + 1)) + 1;
    score += chunk.tf[t] * idf;
  }

  return score;
}

function categoryBonus(queryTokens: string[], chunk: any): number {
  const text = queryTokens.join(' ');
  const cat = chunk.category;

  if (cat === 'contact' && /contact|email|reach|social|linkedin|github|site|website/.test(text)) return 1.5;
  if (cat === 'projects' && /project|built|made|app|tool|device|work|developed/.test(text)) return 1.3;
  if (cat === 'about' && chunk.id === 'bio_001' && /who|rsmk|about/.test(text)) return 2.5;
  if (cat === 'about' && /who|rsmk|manikanta|background|study|student|personality|book|philosophy/.test(text)) return 1.3;
  if (cat === 'skills' && /skill|language|tech|stack|know|expert|hardware|sensor|tool/.test(text)) return 1.3;
  if (cat === 'achievements' && /award|prize|hackathon|win|achievement|internship|certificate/.test(text)) return 1.4;
  if (cat === 'brand' && /brand|company|rsmk technologies|product|division/.test(text)) return 1.2;

  return 1.0;
}

const INDEX = buildIndex(knowledgeBase.chunks);

// ─── Public API ───────────────────────────────────────────────────────────────

export function retrieveChunks(query: string, { topK = 3, minScore = 0.01 } = {}): any[] {
  const queryTokens = tokenise(query);
  if (!queryTokens.length) return [];

  const scored = INDEX.chunks.map((chunk: any) => ({
    chunk,
    score: tfidfScore(queryTokens, chunk, INDEX) * categoryBonus(queryTokens, chunk)
  }));

  return scored
    .filter((r: any) => r.score >= minScore)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, topK)
    .map((r: any) => r.chunk);
}

export function retrieveContext(query: string, opts = {}): string {
  const chunks = retrieveChunks(query, opts);

  if (!chunks.length) {
    return '';
  }

  const contextLines = chunks.map((c: any, i: number) =>
    `[${i + 1}] ${c.title}\n${c.content}`
  );

  return [
    '--- RELEVANT KNOWLEDGE BASE CONTEXT ---',
    ...contextLines,
    '--- END OF CONTEXT ---'
  ].join('\n\n');
}

export function retrieveByCategory(category: string, limit = 10): any[] {
  return INDEX.chunks
    .filter((c: any) => c.category === category)
    .slice(0, limit);
}

export function listCategories(): string[] {
  const cats = new Set(INDEX.chunks.map((c: any) => c.category));
  return Array.from(cats);
}
