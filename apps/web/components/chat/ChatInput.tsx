"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AudioLines, Paperclip, SendHorizontal, Sparkles } from "lucide-react";

interface Props { 
  prompt: string; 
  setPrompt: (value: string) => void; 
  loading: boolean; 
  onSend: () => void; 
}

export default function ChatInput({ prompt, setPrompt, loading, onSend }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => { 
    const textarea = textareaRef.current; 
    if (!textarea) return; 
    textarea.style.height = "auto"; 
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`; 
  }, [prompt]);
  
  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) { 
    if (event.key === "Enter" && !event.shiftKey) { 
      event.preventDefault(); 
      onSend(); 
    } 
  }
  
  return (
    <div className="border-t border-white/5 bg-background/80 px-4 py-6 backdrop-blur-3xl sm:px-6">
      <div className="mx-auto max-w-4xl">
        <motion.div 
          className="relative rounded-3xl border border-white/10 bg-surface/60 p-2 shadow-2xl backdrop-blur-md transition-all duration-300 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10"
        >
          <div className="flex items-end gap-2 px-2">
            <button title="Attach file" className="mb-1 rounded-2xl p-3 text-slate-400 transition hover:bg-white/5 hover:text-primary">
              <Paperclip className="h-5 w-5" />
            </button>
            
            <textarea 
              ref={textareaRef} 
              value={prompt} 
              rows={1} 
              onChange={(event) => setPrompt(event.target.value)} 
              onKeyDown={handleKeyDown} 
              placeholder="Ask anything about this dataset…" 
              className="max-h-44 min-h-[44px] flex-1 resize-none bg-transparent py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500" 
            />
            
            <button 
              title="Voice input" 
              className="mb-1 hidden rounded-2xl p-3 text-slate-400 transition hover:bg-white/5 hover:text-primary sm:block"
            >
              <AudioLines className="h-5 w-5" />
            </button>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || !prompt.trim()} 
              onClick={onSend} 
              className="mb-1 flex h-11 items-center gap-2 rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_0_15px_rgba(34,211,238,0.2)] transition hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <SendHorizontal className="h-4 w-4" />
              )}
              <span className="hidden sm:block">Send</span>
            </motion.button>
          </div>
          
          <div className="flex items-center justify-between px-4 pb-2 pt-1 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary" /> Char(t)ex AI can make mistakes.</span>
            <span className="text-slate-500">{prompt.length}/2,000</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
