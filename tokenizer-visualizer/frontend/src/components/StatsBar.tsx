import React from 'react';
import { useTokenizerStore } from '../store/tokenizerStore';

export default function StatsBar() {
    const { result, input } = useTokenizerStore();

    if (!result) return null;

    const words = Math.max(1, result.tokens.filter(t => t.type === 'word').length);
    const isSingleChar = input.trim().length <= 1;
    const ratio = isSingleChar ? 'N/A' : (result.total_tokens / words).toFixed(2);
    const reusedIDs = result.total_tokens - result.unique_tokens;

    const stats = [
        { label: 'Total Tokens', value: result.total_tokens, help: 'Total number of tokens generated from the input text.' },
        { label: 'Unique Tokens', value: result.unique_tokens, help: 'Number of distinct token IDs in the sequence.' },
        { label: 'Words (Est)', value: isSingleChar ? (input.trim().length === 1 ? 1 : 0) : words, help: 'Estimated number of real words.' },
        { label: 'Token/Word', value: ratio, help: 'Average number of tokens used per word. Lower is more efficient.' },
        { label: 'Reused IDs', value: reusedIDs, help: 'How many times the tokenizer used a token ID more than once.' },
        { label: 'Reuse Rate %', value: (result.reuse_rate * 100).toFixed(1) + '%', help: 'Percentage of the token sequence made up of repeated tokens.' },
        { label: 'Vocab Size', value: result.vocab_size.toLocaleString(), help: 'Total number of tokens this specific model knows.' }
    ];

    return (
        <div className="relative w-full">
            <div className="absolute -top-4 right-0 bg-dark-card border border-dark-border px-3 py-1 rounded-full text-xs text-neon-green">
                {result.processing_time_ms.toFixed(0)} ms
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {stats.map((s, i) => (
                    <div key={i} title={s.help} className="bg-dark-card border border-dark-border rounded-lg p-4 flex flex-col items-center justify-center hover:border-neon-purple transition-colors cursor-help">
                        <div className="text-2xl font-bold font-mono text-neon-purple mb-1">
                            {s.value}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 font-semibold text-center mt-1">
                            {s.label}
                            <span className="text-[9px] bg-gray-800 rounded-full w-3.5 h-3.5 flex items-center justify-center text-gray-400">?</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
