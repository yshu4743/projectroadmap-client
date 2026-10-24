export const CATEGORY_LABELS = {
  poem: 'Poem',
  'short-story': 'Short Story',
  'book-review': 'Book Review',
  essay: 'Essay',
};

export const LANGUAGE_LABELS = {
  malayalam: 'മലയാളം',
  english: 'English',
  other: 'Other',
};

export const STATUS_LABELS = {
  draft: 'Draft',
  pending: 'Pending Approval',
  approved: 'Approved',
  published: 'Published',
  rejected: 'Rejected',
};

export const STATUS_STYLES = {
  draft: 'bg-stone-100 text-stone-600',
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-800',
  published: 'bg-moss/10 text-moss',
  rejected: 'bg-red-100 text-red-800',
};

export const MALAYALAM_PHONETIC_MAP = {
  a: 'ആ', 'aa': 'ാ', i: 'ഇ', ii: 'ീ', 'ee': 'ി', u: 'ഉ', uu: 'ൂ', 'oo': 'ു',
  e: 'എ', 'ea': 'െ', o: 'ഒ', 'oa': 'ൊ',
  k: 'ക്', kh: 'ഖ്', g: 'ഗ്', gh: 'ഘ്', 'ng': 'ം',
  ch: 'ച്', chh: 'ഛ്', j: 'ജ്', jh: 'ഝ്', nj: 'ഞ്',
  'tt': 'ട്ട്', 'dd': 'ഡ്', 'nn': 'ണ്',
  t: 'ത്', th: 'ഥ്', d: 'ദ്', dh: 'ധ്', n: 'ന്',
  p: 'പ്', ph: 'ഫ്', b: 'ബ്', bh: 'ഭ്', m: 'മ്',
  y: 'യ്', r: 'ര്', l: 'ല്', v: 'വ്', sh: 'ശ്', s: 'സ്', h: 'ഹ്',
  li: 'ള്', ri: 'റ്', z: 'ഴ്',
  'm': 'മ്',
};

export const malayalamIsTransliteration = (text) =>
  /^[a-zA-Z\s.,'':;!?()\-"]*$/.test(text) && text.trim().length > 0;

export function hasMalayalam(text = '') {
  return /[\u0D00-\u0D7F]/.test(text);
}