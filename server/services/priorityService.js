const Sentiment = require('sentiment');
const stringSimilarity = require('string-similarity');

const sentimentAnalyzer = new Sentiment();

// ─── Layer 1: Urgent keyword list ────────────────────────────────────────────
const URGENT_KEYWORDS = [
  'fire', 'electric', 'electricity', 'electrocution', 'accident',
  'emergency', 'danger', 'dangerous', 'broken wire', 'live wire',
  'collapse', 'collapsed', 'flood', 'flooding', 'explosion',
  'injury', 'injured', 'bleeding', 'unconscious', 'faint',
  'gas leak', 'smoke', 'burning', 'short circuit',
];

// ─── Layer 4: Urgent similarity phrases ──────────────────────────────────────
const URGENT_PHRASES = [
  'about to fall',
  'not safe',
  'dangerous situation',
  'urgent repair needed',
  'serious issue',
  'immediate action required',
  'life threatening',
  'needs urgent attention',
  'very dangerous',
  'please help urgently',
];

const SIMILARITY_THRESHOLD = 0.45; // tuned lower to catch partial matches

/**
 * Layer 1 — Keyword Detection
 * Returns { triggered: bool, matchedKeywords: string[] }
 */
const runKeywordLayer = (text) => {
  const lower = text.toLowerCase();
  const matched = URGENT_KEYWORDS.filter((kw) => lower.includes(kw));
  return { triggered: matched.length > 0, matchedKeywords: matched };
};

/**
 * Layer 2 — Sentiment Analysis
 * Returns { score: number, isNegative: bool, isStronglyNegative: bool }
 * sentiment score: negative = bad, positive = good
 */
const runSentimentLayer = (text) => {
  const result = sentimentAnalyzer.analyze(text);
  return {
    score: result.score,
    isNegative: result.score < 0,
    isStronglyNegative: result.score <= -3,
  };
};

/**
 * Layer 3 — Smart Fallback
 * Long + negative text → at least Medium
 * Returns { triggered: bool }
 */
const runFallbackLayer = (text, sentimentResult) => {
  const wordCount = text.trim().split(/\s+/).length;
  return {
    triggered: wordCount > 15 && sentimentResult.isNegative,
    wordCount,
  };
};

/**
 * Layer 4 — Similarity Detection
 * Compares each sentence in the text against urgent phrases
 * Returns { triggered: bool, bestMatch: string, bestScore: number }
 */
const runSimilarityLayer = (text) => {
  // Split text into sentences/chunks for better matching
  const chunks = text
    .toLowerCase()
    .split(/[.!?,]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);

  let bestScore = 0;
  let bestMatch = '';
  let bestPhrase = '';

  for (const chunk of chunks) {
    const result = stringSimilarity.findBestMatch(chunk, URGENT_PHRASES);
    const score  = result.bestMatch?.rating || 0;
    if (score > bestScore) {
      bestScore  = score;
      bestMatch  = chunk;
      bestPhrase = result.bestMatch?.target || '';
    }
  }

  return {
    triggered: bestScore >= SIMILARITY_THRESHOLD,
    bestMatch,
    bestPhrase,
    bestScore: parseFloat(bestScore.toFixed(3)),
  };
};

/**
 * Main function — combines all 4 layers into a final priority decision
 * @param {string} title
 * @param {string} description
 * @returns {{ priority: 'High'|'Medium'|'Low', reason: string, aiGenerated: true, details: object }}
 */
const analyzePriority = (title, description) => {
  const fullText = `${title} ${description}`;

  const keyword   = runKeywordLayer(fullText);
  const sentiment = runSentimentLayer(fullText);
  const fallback  = runFallbackLayer(fullText, sentiment);
  const similarity = runSimilarityLayer(fullText);

  const reasons = [];
  let score = 0; // scoring: High ≥ 3, Medium ≥ 1, Low = 0

  // Layer 1 contribution
  if (keyword.triggered) {
    score += 3;
    reasons.push(`Urgent keyword detected: "${keyword.matchedKeywords[0]}"`);
  }

  // Layer 2 contribution
  if (sentiment.isStronglyNegative) {
    score += 2;
    reasons.push(`Strongly negative sentiment (score: ${sentiment.score})`);
  } else if (sentiment.isNegative) {
    score += 1;
    reasons.push(`Negative sentiment (score: ${sentiment.score})`);
  }

  // Layer 3 contribution
  if (fallback.triggered) {
    score += 1;
    reasons.push(`Long complaint (${fallback.wordCount} words) with negative tone`);
  }

  // Layer 4 contribution
  if (similarity.triggered) {
    score += 2;
    reasons.push(`Similar to urgent phrase: "${similarity.bestPhrase}" (score: ${similarity.bestScore})`);
  }

  // Final decision
  let priority;
  if (score >= 3) {
    priority = 'High';
  } else if (score >= 1) {
    priority = 'Medium';
  } else {
    priority = 'Low';
  }

  return {
    priority,
    reason: reasons.length > 0 ? reasons.join(' + ') : 'No urgent signals detected',
    aiGenerated: true,
    details: {
      keywordLayer:    { triggered: keyword.triggered,    matched: keyword.matchedKeywords },
      sentimentLayer:  { score: sentiment.score,          isStronglyNegative: sentiment.isStronglyNegative },
      fallbackLayer:   { triggered: fallback.triggered,   wordCount: fallback.wordCount },
      similarityLayer: { triggered: similarity.triggered, bestPhrase: similarity.bestPhrase, score: similarity.bestScore },
      totalScore: score,
    },
  };
};

module.exports = { analyzePriority };
