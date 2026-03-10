import React, { useCallback, useState } from 'react';
import { useTokenizerStore } from '../store/tokenizerStore';
import { Copy, Check } from 'lucide-react';

export default function TokenDisplay() {
    const { result, selectedTokenId, selectToken } = useTokenizerStore();
    const [copied, setCopied] = useState(false);

    // Deterministic color generation based on ID
    // Deterministic vibrant toy color generation based on ID
    const getColor = useCallback((id: number, type: string) => {
        const toyColors = [
            '#e63946', // Vibrant Red
            '#4361ee', // Bright Blue
            '#fca311', // Deep Yellow/Orange
            '#06d6a0', // Mint Green
            '#f72585', // Hot Pink
            '#7209b7', // Purple
            '#00f5d4'  // Neon Cyan
        ];
        return toyColors[(id * 17) % toyColors.length];
    }, []);

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
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-300">Lexical Token Segmentation</h2>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 bg-dark-bg border border-dark-border hover:border-neon-purple rounded text-sm transition-colors"
                >
                    {copied ? <Check className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy All IDs'}
                </button>
            </div>

            <div className="mb-4 p-4 border border-blue-500/30 bg-blue-500/10 rounded-lg text-blue-200 text-sm leading-relaxed">
                <h3 className="font-bold flex items-center gap-2 mb-1 text-blue-400">
                    <span className="text-xl">💡</span> The LEGO Pieces
                </h3>
                <p>
                    See how your words got broken into colored blocks? Some big, common words get to stay together as one big LEGO piece. But tricky or long words get chopped into smaller pieces so the robot can understand them easier! Try hovering over a piece to see its secrets.
                </p>
            </div>

            <div className="flex flex-wrap gap-x-2 gap-y-8 text-lg items-end mt-8 p-4">
                {result.tokens.map((token, i) => {
                    const isSelected = selectedTokenId === token.id;
                    const color = getColor(token.id, token.type);

                    // Add a tiny bit of scatter/rotation for the messy playroom aesthetic
                    const rotations = ['-rotate-2', '-rotate-1', 'rotate-0', 'rotate-1', 'rotate-2'];
                    const scatterRot = isSelected ? 'rotate-0' : rotations[(i * 3) % rotations.length];

                    // Determine how many studs based on word length
                    const nStuds = Math.max(2, Math.min(4, Math.ceil(token.display.length / 3)));

                    return (
                        <div
                            key={`${token.id}-${i}`}
                            onClick={() => selectToken(token.id)}
                            className={`group relative flex flex-col items-center justify-center px-4 py-3 cursor-pointer transition-all duration-300 rounded-lg ${scatterRot}
                                ${isSelected ? 'z-30 -translate-y-4 scale-110 shadow-[0_20px_40px_rgba(0,0,0,0.8)]' : 'hover:-translate-y-2 hover:shadow-2xl hover:z-20 shadow-[0_10px_20px_rgba(0,0,0,0.6)]'}
                            `}
                            style={{
                                backgroundColor: color,
                                borderBottom: `8px solid rgba(0,0,0,0.4)`, // Thick 3D base
                                borderRight: `4px solid rgba(0,0,0,0.3)`,
                                borderLeft: `2px solid rgba(255,255,255,0.3)`,
                                borderTop: `2px solid rgba(255,255,255,0.4)`,
                                boxShadow: `inset 0 10px 20px rgba(255,255,255,0.3), inset 0 -5px 10px rgba(0,0,0,0.2), 0 15px 25px rgba(0,0,0,0.6)`
                            }}
                        >
                            {/* Realistic LEGO Stud Tops */}
                            <div className="absolute -top-[10px] left-0 right-0 flex justify-evenly px-2 gap-1 pointer-events-none">
                                {Array.from({ length: nStuds }).map((_, idx) => (
                                    <div
                                        key={`stud-${idx}`}
                                        className="w-5 h-3 rounded-full"
                                        style={{
                                            backgroundColor: color,
                                            borderTop: '2px solid rgba(255,255,255,0.6)',
                                            borderLeft: '2px solid rgba(255,255,255,0.3)',
                                            borderRight: '2px solid rgba(0,0,0,0.4)',
                                            borderBottom: '1px solid rgba(0,0,0,0.2)',
                                            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5), 0 -2px 5px rgba(0,0,0,0.2)'
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Text "Engraved" into plastic */}
                            <span
                                className="font-mono font-black whitespace-pre z-10 text-white tracking-widest text-lg md:text-xl"
                                style={{
                                    textShadow: '0 -1px 1px rgba(0,0,0,0.6), 0 1px 1px rgba(255,255,255,0.4)'
                                }}
                            >
                                {token.display.replace(/ /g, '·')}
                            </span>

                            {/* Sticker/Label for ID */}
                            <span className="text-[10px] text-black font-mono mt-2 bg-white/90 px-2 py-0.5 rounded-sm shadow-sm border border-black/10 tracking-widest transform rotate-1">
                                ID:{token.id}
                            </span>

                            {/* Toy Feature Tooltip (Sci-Fi Hologram style) */}
                            <div className="absolute bottom-[130%] mb-2 hidden group-hover:block z-50 w-max max-w-[220px] p-4 bg-[#0a0f18]/95 border-2 border-neon-cyan/50 rounded-xl shadow-[0_0_30px_rgba(0,255,255,0.3)] backdrop-blur-md text-xs text-left transform pointer-events-none transition-all">
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0a0f18] border-b-2 border-r-2 border-neon-cyan/50 rotate-45"></div>
                                <h4 className="text-neon-cyan font-mono font-bold uppercase tracking-widest mb-2 border-b border-neon-cyan/30 pb-1">Block Scanner Data</h4>
                                <p className="mb-2"><span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Raw Text Value</span> <span className="font-mono text-white text-base">"{token.text}"</span></p>
                                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/10">
                                    <div>
                                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Vault ID</span>
                                        <span className="text-neon-pink font-mono font-bold text-base bg-neon-pink/10 px-1 rounded">{token.id}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Usage</span>
                                        <span className="text-neon-yellow font-mono font-bold text-base">{token.frequency}x</span>
                                    </div>
                                </div>
                                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                                    <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Component Type</span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-black ${token.type === 'subword' ? 'bg-neon-yellow' : 'bg-neon-green'}`}>
                                        {token.type === 'subword' ? '🧩 SNAP-ON' : '📦 WHOLE'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
