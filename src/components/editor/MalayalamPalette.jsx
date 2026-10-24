import { Keyboard } from 'lucide-react';
import { useState } from 'react';

const SWARAM = [
  'അ', 'ആ', 'ഇ', 'ഈ', 'ഉ', 'ഊ', 'ഋ', 'എ', 'ഏ', 'ഐ', 'ഒ', 'ഓ', 'ഔ',
  'ം', 'ഃ', '്',
];

const VYANJANAM = [
  'ക', 'ഖ', 'ഗ', 'ഘ', 'ങ',
  'ച', 'ഛ', 'ജ', 'ഝ', 'ഞ',
  'ട', 'ഠ', 'ഡ', 'ഢ', 'ണ',
  'ത', 'ഥ', 'ദ', 'ധ', 'ന',
  'പ', 'ഫ', 'ബ', 'ഭ', 'മ',
  'യ', 'ര', 'ല', 'വ', 'ശ', 'ഷ', 'സ', 'ഹ', 'ള', 'ഴ', 'റ',
  'ക്ക', 'ങ്ങ', 'ച്ച', 'ഞ്ഞ', 'ട്ട', 'ണ്ട', 'ത്ത', 'ന്ന', 'പ്പ', 'മ്മ', 'ല്ല', 'വ്വ',
];

const ROMAN_MAP = {
  a: 'അ', aa: 'ആ', i: 'ഇ', ii: 'ഈ', u: 'ഉ', uu: 'ഊ', e: 'എ', 'ea': 'േ', o: 'ഒ',
  k: 'ക', kh: 'ഖ', g: 'ഗ', gh: 'ഘ', 'ng': 'ങ',
  ch: 'ച', j: 'ജ', 'tt': 'ട', d: 'ദ', 'dd': 'ഡ', t: 'ത', th: 'ഥ', n: 'ന',
  p: 'പ', ph: 'ഫ', b: 'ബ', bh: 'ഭ', m: 'മ',
  y: 'യ', r: 'ര', rr: 'റ', l: 'ല', ll: 'ള', v: 'വ', sh: 'ശ', s: 'സ', h: 'ഹ',
  'zh': 'ഴ', 'nn': 'ണ്', 'tch': 'ച്ച്', 'ss': 'ഷ',
};

function insertHTML(html) {
  document.execCommand('insertHTML', false, html);
}

export default function MalayalamPalette({ onClose }) {
  const [tab, setTab] = useState('vyanjanam');
  const [roman, setRoman] = useState('');

  const transliterate = () => {
    if (!roman.trim()) return;
    const keys = Object.keys(ROMAN_MAP).sort((a, b) => b.length - a.length);
    let out = roman.trim().toLowerCase();
    for (const k of keys) {
      out = out.split(k).join(ROMAN_MAP[k]);
    }
    insertHTML(out);
    setRoman('');
  };

  return (
    <div className="rounded-xl border border-moss/20 bg-white p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-bold text-moss">
          <Keyboard className="h-4 w-4" /> മലയാളം · Malayalam input
        </p>
        <button type="button" onClick={onClose} className="text-xs font-semibold text-fadedink hover:text-ink">
          Close ✕
        </button>
      </div>

      <div className="mb-3 flex gap-2">
        {[
          { k: 'vyanjanam', l: 'വ്യഞ്ജനങ്ങൾ (Consonants)' },
          { k: 'swaram', l: 'സ്വരങ്ങൾ (Vowels)' },
        ].map(({ k, l }) => (
          <button
            type="button"
            key={k}
            onClick={() => setTab(k)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${tab === k ? 'bg-moss text-white' : 'bg-moss/10 text-moss'}`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mb-3 flex max-h-40 flex-wrap gap-1.5 overflow-y-auto">
        {(tab === 'vyanjanam' ? VYANJANAM : SWARAM).map((c) => (
          <button
            type="button"
            key={c}
            onClick={() => insertHTML(c)}
            className={`malayalam rounded-md border border-fadedink/15 px-2.5 py-1.5 text-lg leading-none transition hover:bg-moss hover:text-white ${c === '്' ? 'bg-brass/10 text-brass' : 'bg-paper'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="input-base malayalam flex-1"
          placeholder="roman → Malayalam · e.g. pusthakam"
          value={roman}
          onChange={(e) => setRoman(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              transliterate();
            }
          }}
        />
        <button type="button" onClick={transliterate} className="btn-secondary whitespace-nowrap">
          Insert →
        </button>
      </div>
    </div>
  );
}