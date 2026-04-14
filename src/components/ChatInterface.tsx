import React, { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface ChatInterfaceProps {
  onGenerate: (prompt: string) => Promise<void>;
  isGenerating: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="p-4 border-t border-white/10 bg-[#0A0A0A]">
      <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
          <Sparkles className="w-5 h-5" />
        </div>
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to build (e.g., 'A pitch deck for a sustainable coffee brand')..."
          className="w-full h-14 pl-12 pr-24 bg-white/5 border-white/10 rounded-2xl focus:ring-white/20 focus:border-white/20 text-lg placeholder:text-white/20"
          disabled={isGenerating}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Button 
            type="submit" 
            disabled={!prompt.trim() || isGenerating}
            className="h-10 px-6 rounded-xl bg-white text-black hover:bg-white/90 font-medium"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <span>Generate</span>
                <Send className="w-4 h-4" />
              </div>
            )}
          </Button>
        </div>
      </form>
      <div className="mt-3 flex justify-center gap-4 text-[10px] uppercase tracking-widest text-white/20 font-mono">
        <span>Atomic Engine v3.1 Pro</span>
        <span className="text-white/10">•</span>
        <span>Multi-Model Orchestration</span>
        <span className="text-white/10">•</span>
        <span>Context Persistent</span>
      </div>
    </div>
  );
};
