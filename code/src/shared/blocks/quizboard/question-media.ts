/**
 * Optional question visuals.  The data model deliberately keeps visuals
 * small and portable so an exported board can run without a network request.
 * Exact educational diagrams (for example a slope graph) are generated as
 * SVG instead of asking an image model to place labels or coordinates.
 */
export type QuestionMediaKind = 'chart' | 'diagram' | 'map' | 'illustration';
export type QuestionMediaSource = 'generated' | 'uploaded' | 'none';

export type QuestionMedia = {
  kind: QuestionMediaKind;
  alt: string;
  prompt?: string;
  source: QuestionMediaSource;
  url?: string;
  needsImage?: boolean;
};

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function safeKind(value: unknown): QuestionMediaKind {
  return value === 'diagram' || value === 'map' || value === 'illustration' ? value : 'chart';
}

function safeSource(value: unknown): QuestionMediaSource {
  return value === 'uploaded' || value === 'none' ? value : 'generated';
}

/** Keep only the fields that can safely travel through the quiz JSON. */
export function normalizeQuestionMedia(value: unknown): QuestionMedia | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const media = value as Record<string, unknown>;
  const alt = clean(media.alt);
  const prompt = clean(media.prompt);
  const url = clean(media.url);
  const needsImage = media.needsImage === true || Boolean(url);
  if (!alt && !prompt && !url && !needsImage) return undefined;
  return {
    kind: safeKind(media.kind),
    alt: alt || 'Optional visual for this question',
    prompt: prompt || undefined,
    source: safeSource(media.source),
    url: url || undefined,
    needsImage,
  };
}

function svgDataUrl(svg: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

/** A classroom-readable coordinate graph for slope/rate-of-change questions. */
export function buildSlopeGraphDataUrl() {
  const lines = [
    '<line x1="70" y1="250" x2="430" y2="250" stroke="#243b53" stroke-width="3"/>',
    '<line x1="250" y1="35" x2="250" y2="465" stroke="#243b53" stroke-width="3"/>',
    '<line x1="90" y1="410" x2="410" y2="90" stroke="#e76f51" stroke-width="8" stroke-linecap="round"/>',
    '<line x1="75" y1="115" x2="425" y2="325" stroke="#2a9d8f" stroke-width="8" stroke-linecap="round"/>',
    '<line x1="95" y1="325" x2="405" y2="195" stroke="#457b9d" stroke-width="8" stroke-linecap="round"/>',
  ].join('');
  const ticks = Array.from({ length: 9 }, (_, index) => {
    const position = 90 + index * 40;
    const value = index - 4;
    return `<line x1="${position}" y1="244" x2="${position}" y2="256" stroke="#243b53" stroke-width="2"/><text x="${position}" y="278" text-anchor="middle" font-size="16" fill="#496277">${value}</text><line x1="244" y1="${position}" x2="256" y2="${position}" stroke="#243b53" stroke-width="2"/><text x="230" y="${position + 5}" text-anchor="end" font-size="16" fill="#496277">${4 - index}</text>`;
  }).join('');
  return svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" role="img" aria-label="Coordinate grid with three colored lines"><rect width="500" height="500" fill="#f7fbff"/><g stroke="#d8e3ec" stroke-width="1">${Array.from({ length: 9 }, (_, index) => { const position = 90 + index * 40; return `<line x1="${position}" y1="50" x2="${position}" y2="450"/><line x1="50" y1="${position}" x2="450" y2="${position}"/>`; }).join('')}</g>${ticks}<g>${lines}</g><text x="463" y="245" font-size="18" fill="#243b53">x</text><text x="258" y="28" font-size="18" fill="#243b53">y</text></svg>`);
}

/** A simple, deterministic moon-phase strip for science topics. */
export function buildMoonPhasesDataUrl() {
  const phases = [
    ['New', '#172d47', '#172d47'], ['Waxing crescent', '#172d47', '#c8f169'],
    ['First quarter', '#172d47', '#f5f4ed'], ['Waxing gibbous', '#c8f169', '#f5f4ed'],
    ['Full', '#f5f4ed', '#f5f4ed'], ['Waning gibbous', '#f5f4ed', '#c8f169'],
    ['Third quarter', '#f5f4ed', '#172d47'], ['Waning crescent', '#c8f169', '#172d47'],
  ];
  const circles = phases.map(([label, left, right], index) => {
    const cx = 38 + index * 61;
    return `<circle cx="${cx}" cy="45" r="22" fill="${left}"/><path d="M ${cx} 23 A 22 22 0 0 1 ${cx} 67 A 22 22 0 0 0 ${cx} 23" fill="${right}"/><text x="${cx}" y="84" text-anchor="middle" font-size="8" fill="#496277">${label}</text>`;
  }).join('');
  return svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 100" role="img" aria-label="Eight phases of the Moon in order"><rect width="520" height="100" rx="12" fill="#f7fbff"/>${circles}</svg>`);
}

/** A compact cell diagram for biology prompts that ask about structure. */
export function buildCellDiagramDataUrl() {
  return svgDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 300" role="img" aria-label="Simplified labeled animal cell diagram"><rect width="520" height="300" rx="18" fill="#f7fbff"/><ellipse cx="255" cy="150" rx="190" ry="105" fill="#d9f3df" stroke="#347957" stroke-width="6"/><ellipse cx="255" cy="150" rx="58" ry="45" fill="#c8f169" stroke="#347957" stroke-width="4"/><circle cx="180" cy="110" r="18" fill="#ff8d5c"/><circle cx="335" cy="185" r="15" fill="#457b9d"/><circle cx="145" cy="180" r="12" fill="#457b9d"/><text x="255" y="156" text-anchor="middle" font-size="16" fill="#15231e">nucleus</text><text x="87" y="55" font-size="14" fill="#496277">cell membrane</text><line x1="145" y1="65" x2="180" y2="82" stroke="#496277" stroke-width="2"/><text x="365" y="250" font-size="14" fill="#496277">organelles</text><line x1="365" y1="235" x2="335" y2="198" stroke="#496277" stroke-width="2"/></svg>');
}

/**
 * Infer a useful visual only when the question genuinely benefits from one.
 * The caller can still pass an explicit AI/uploaded media object.
 */
export function inferQuestionMedia(_topic: string, prompt: string, existing?: QuestionMedia): QuestionMedia | undefined {
  const questionText = clean(prompt).toLowerCase();
  // A board topic provides context, not a reason to attach a visual to every
  // square. Only infer an image when the individual prompt contains a visual
  // cue or a concept that is naturally represented by the matching diagram.
  const wantsSlopeGraph = /(slope|rate of change|rise over run|linear relationship)/i.test(questionText)
    && /(graph|coordinate|plot|line|rise over run|identify|compare|shown|diagram)/i.test(questionText);
  const wantsMoonDiagram = /(moon phase|phases of the moon|lunar cycle)/i.test(questionText)
    || (/(tide|gravity)/i.test(questionText) && /(moon|lunar)/i.test(questionText) && /(diagram|orbit|position|phase|shown)/i.test(questionText));
  const wantsCellDiagram = /(cell|organelle|nucleus|membrane)/i.test(questionText)
    && /(structure|diagram|label|membrane|nucleus|organelle|shown)/i.test(questionText);
  const stillRelevant = (kind: QuestionMediaKind) => (kind === 'chart' && wantsSlopeGraph)
    || (kind === 'diagram' && (wantsMoonDiagram || wantsCellDiagram));
  // Preserve teacher-uploaded or explicitly supplied visuals. Generated
  // visuals are re-inferred when a teacher changes the prompt, so a slope
  // chart does not linger on an unrelated question.
  if (existing?.url && existing.source !== 'generated') return existing;
  if (existing?.url && existing.source === 'generated') {
    if (stillRelevant(existing.kind)) return existing;
  }
  if (wantsSlopeGraph) {
    return { kind: existing?.kind || 'chart', source: 'generated', alt: existing?.alt || 'Coordinate graph with three lines for comparing slope', prompt: existing?.prompt || 'A labeled coordinate grid with several lines whose slopes can be compared.', url: buildSlopeGraphDataUrl(), needsImage: true };
  }
  if (wantsMoonDiagram) {
    return { kind: existing?.kind || 'diagram', source: 'generated', alt: existing?.alt || 'The eight phases of the Moon in order', prompt: existing?.prompt || 'A horizontal diagram showing the eight Moon phases in order.', url: buildMoonPhasesDataUrl(), needsImage: true };
  }
  if (wantsCellDiagram) {
    return { kind: existing?.kind || 'diagram', source: 'generated', alt: existing?.alt || 'Simplified labeled cell structure diagram', prompt: existing?.prompt || 'A simple labeled cell diagram showing the membrane, nucleus, and organelles.', url: buildCellDiagramDataUrl(), needsImage: true };
  }
  // Keep an explicit media request even before an image URL is available;
  // only remove a generated URL when its new prompt no longer needs it.
  return existing?.url ? (existing.source === 'generated' ? undefined : existing) : existing;
}

export function isOfflineSafeMedia(media?: QuestionMedia) {
  return Boolean(media?.url?.startsWith('data:image/'));
}
