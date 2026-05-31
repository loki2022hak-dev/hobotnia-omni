'use client';
import { Send } from 'lucide-react';
import { useState } from 'react';
export function Composer({ onSubmit, placeholder = 'Що хочеш розповісти?' }: { onSubmit: (content: string) => void; placeholder?: string }) {
  const [content, setContent] = useState('');
  const valid = content.trim().length > 0;
  return (
    <div className="card mb-5 p-4">
      <textarea required className="min-h-24 w-full resize-none" placeholder={placeholder} value={content} onChange={(e) => setContent(e.target.value)} />
      <button disabled={!valid} onClick={() => { if (!valid) return; onSubmit(content.trim()); setContent(''); }} className="mt-3 inline-flex items-center gap-2 bg-brand px-4 py-2 font-semibold text-ink disabled:opacity-50"><Send size={16}/>Опублікувати</button>
    </div>
  );
}
