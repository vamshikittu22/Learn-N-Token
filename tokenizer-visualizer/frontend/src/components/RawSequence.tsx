import React, { useState } from 'react';
import { useTokenizerStore } from '../store/tokenizerStore';
import { Copy, Check } from 'lucide-react';

export default function RawSequence() {
    const { result, selectedTokenId } = useTokenizerStore();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (result) {
            navigator.clipboard.writeText(JSON.stringify(result.raw_ids));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!result) return null;

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="mb-2 p-4 border border-blue-500/30 bg-blue-500/10 rounded-lg text-blue-200 text-sm leading-relaxed">
                <h3 className="font-bold flex items-center gap-2 mb-1 text-blue-400">
                    <span className="text-xl">💡</span> The Secret Number Code
                </h3>
                <p>
                    Robots can't read English! Like, at all! So we have to swap every single LEGO block from above for a secret number code. This super-long list of numbers is what the robot's brain gets to "eat". The words you typed are completely gone now!
                </p>
            </div>

            <div className="flex justify-between items-center mb-2 mt-2">
                <p className="text-sm font-semibold text-gray-300">
                    Numeric Output Vector
                </p>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-neon-cyan">Count: {result.total_tokens}</span>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-1.5 bg-dark-bg border border-dark-border hover:border-neon-purple rounded text-sm transition-colors"
                    >
                        {copied ? <Check className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
            </div>

            <div className="relative flex flex-wrap gap-x-3 gap-y-8 bg-[#0a0f18] border-2 border-[#1e293b] rounded-2xl p-8 mt-4 font-mono leading-relaxed shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] overflow-hidden">
                {/* Motherboard Trace Background */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00ffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                {result.raw_ids.map((id, i) => {
                    const isSelected = id === selectedTokenId;
                    return (
                        <div
                            key={i}
                            className={`group relative flex flex-col items-center justify-center min-w-[4rem] px-2 py-3 font-black font-mono rounded-sm border-2 transition-all duration-300 cursor-default
                            ${isSelected
                                    ? 'bg-neon-pink text-white border-white scale-110 shadow-[0_0_20px_rgba(247,37,133,0.8)] z-10'
                                    : 'bg-[#111122] border-[#2d2d5c] text-neon-cyan hover:border-cyan-400 hover:bg-[#1a1a33] hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(0,255,255,0.4)] hover:z-10 shadow-[0_5px_10px_rgba(0,0,0,0.5)]'
                                }`}
                        >
                            {/* Chip pins top */}
                            <div className={`absolute -top-1.5 left-0 right-0 flex justify-evenly px-1 ${isSelected ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'} transition-opacity pointer-events-none`}>
                                <div className={`w-1.5 h-1 rounded-sm ${isSelected ? 'bg-white shadow-[0_0_5px_white]' : 'bg-gray-500'}`}></div>
                                <div className={`w-1.5 h-1 rounded-sm ${isSelected ? 'bg-white shadow-[0_0_5px_white]' : 'bg-gray-500'}`}></div>
                                <div className={`w-1.5 h-1 rounded-sm ${isSelected ? 'bg-white shadow-[0_0_5px_white]' : 'bg-gray-500'}`}></div>
                            </div>

                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] bg-black text-gray-500 font-bold px-1.5 rounded-sm border border-[#2d2d5c] tracking-widest hidden group-hover:block transition-all shadow-[0_0_10px_rgba(0,0,0,0.8)] z-20 pointer-events-none">
                                SEQ:{i}
                            </span>

                            <span className="drop-shadow-[0_0_5px_currentColor] text-xl tracking-wider">{id}</span>

                            {/* Chip pins bottom */}
                            <div className={`absolute -bottom-1.5 left-0 right-0 flex justify-evenly px-1 ${isSelected ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'} transition-opacity pointer-events-none`}>
                                <div className={`w-1.5 h-1 rounded-sm ${isSelected ? 'bg-white shadow-[0_0_5px_white]' : 'bg-gray-500'}`}></div>
                                <div className={`w-1.5 h-1 rounded-sm ${isSelected ? 'bg-white shadow-[0_0_5px_white]' : 'bg-gray-500'}`}></div>
                                <div className={`w-1.5 h-1 rounded-sm ${isSelected ? 'bg-white shadow-[0_0_5px_white]' : 'bg-gray-500'}`}></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
