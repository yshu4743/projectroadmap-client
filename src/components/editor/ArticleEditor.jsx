import { useRef, useState } from 'react';
import {
  Bold, Italic, Underline, Heading2, Heading3, Quote, List,
  ListOrdered, Link as LinkIcon, Eraser, Eye, PenLine, Keyboard, Redo2, Undo2,
} from 'lucide-react';
import MalayalamPalette from './MalayalamPalette';
import { hasMalayalam } from '../../lib/constants';

const toolButton =
  'rounded-md p-1.5 text-ink/80 transition hover:bg-ink/10 disabled:opacity-40';

export default function ArticleEditor({ value, onChange, language }) {
  const [showPalette, setShowPalette] = useState(false);
  const [mode, setMode] = useState('write');
  const editorRef = useRef(null);
  const isMalayalam = language === 'malayalam' || hasMalayalam(value);

  const exec = (command, arg = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    if (onChange) onChange(editorRef.current.innerHTML);
  };

  const onInput = () => {
    if (onChange && editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const addLink = () => {
    const url = prompt('Paste link URL');
    if (url) exec('createLink', url);
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b editorial-rule bg-paper px-3 py-2">
        <div className="flex flex-wrap items-center gap-1">
          <button type="button" className={toolButton} onClick={() => exec('bold')} title="Bold"><Bold className="h-4 w-4" /></button>
          <button type="button" className={toolButton} onClick={() => exec('italic')} title="Italic"><Italic className="h-4 w-4" /></button>
          <button type="button" className={toolButton} onClick={() => exec('underline')} title="Underline"><Underline className="h-4 w-4" /></button>
          <span className="mx-1 h-4 w-px bg-fadedink/20" />
          <button type="button" className={toolButton} onClick={() => exec('formatBlock', 'h2')} title="Heading"><Heading2 className="h-4 w-4" /></button>
          <button type="button" className={toolButton} onClick={() => exec('formatBlock', 'h3')} title="Subheading"><Heading3 className="h-4 w-4" /></button>
          <button type="button" className={toolButton} onClick={() => exec('formatBlock', 'blockquote')} title="Quote"><Quote className="h-4 w-4" /></button>
          <span className="mx-1 h-4 w-px bg-fadedink/20" />
          <button type="button" className={toolButton} onClick={() => exec('insertUnorderedList')} title="Bullets"><List className="h-4 w-4" /></button>
          <button type="button" className={toolButton} onClick={() => exec('insertOrderedList')} title="Numbered"><ListOrdered className="h-4 w-4" /></button>
          <button type="button" className={toolButton} onClick={addLink} title="Link"><LinkIcon className="h-4 w-4" /></button>
          <span className="mx-1 h-4 w-px bg-fadedink/20" />
          <button type="button" className={toolButton} onClick={() => exec('undo')} title="Undo"><Undo2 className="h-4 w-4" /></button>
          <button type="button" className={toolButton} onClick={() => exec('redo')} title="Redo"><Redo2 className="h-4 w-4" /></button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPalette((s) => !s)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
              showPalette ? 'bg-moss text-white' : 'bg-moss/10 text-moss'
            }`}
          >
            <Keyboard className="h-3.5 w-3.5" /> മലയാളം
          </button>
          <div className="flex rounded-full bg-fadedink/10 p-0.5">
            <button
              type="button"
              onClick={() => setMode('write')}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${mode === 'write' ? 'bg-white shadow-sm' : 'text-fadedink'}`}
            >
              <PenLine className="h-3 w-3" /> Write
            </button>
            <button
              type="button"
              onClick={() => setMode('preview')}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${mode === 'preview' ? 'bg-white shadow-sm' : 'text-fadedink'}`}
            >
              <Eye className="h-3 w-3" /> Preview
            </button>
          </div>
        </div>
      </div>

      {showPalette && (
        <div className="border-b editorial-rule bg-moss/5 p-3">
          <MalayalamPalette onClose={() => setShowPalette(false)} />
        </div>
      )}

      {mode === 'write' ? (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={onInput}
          className={`prose-article min-h-[320px] w-full px-4 py-4 outline-none ${
            isMalayalam ? 'malayalam' : ''
          }`}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ) : (
        <div className={`prose-article min-h-[320px] px-4 py-4 ${isMalayalam ? 'malayalam' : ''}`}>
          {value ? (
            <div dangerouslySetInnerHTML={{ __html: value }} />
          ) : (
            <p className="text-fadedink/60">Nothing to preview yet — start writing.</p>
          )}
        </div>
      )}

      {!value && (
        <p className="border-t editorial-rule px-4 py-2.5 text-xs text-fadedink/60">
          Malayalam tip: use the keyboard toggle. English copy renders in a serif reading font automatically.
        </p>
      )}
    </div>
  );
}