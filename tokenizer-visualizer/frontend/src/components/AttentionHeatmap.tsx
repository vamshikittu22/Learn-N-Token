import React, { useState } from 'react';
import { useTokenizerStore } from '../store/tokenizerStore';
import { getAttention } from '../api/tokenizer';
import { Loader2, RefreshCw } from 'lucide-react';

export default function AttentionHeatmap() {
    const { result, input, model } = useTokenizerStore();
    const [realAttention, setRealAttention] = useState<number[][] | null>(null);
    const [realTokens, setRealTokens] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRealAttention = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getAttention(input.substring(0, 100)); // Endpoint truncates to 100
            setRealAttention(res.attention_matrix);
            setRealTokens(res.tokens);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch real attention');
        } finally {
            setLoading(false);
        }
    };

    if (!result) return null;

    if (result.tokens.length < 2) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-12 text-center text-gray-400">
                <h3 className="text-xl text-neon-pink mb-2">Not Enough Tokens</h3>
                <p>Attention heatmaps require at least 2 tokens to visualize multi-directional relationships.</p>
            </div>
        );
    }

    // Use real attention if available, otherwise simulate for first 8 tokens
    const isReal = realAttention !== null;
    const tokensInfo = isReal ? (realTokens || []) : result.tokens.slice(0, 8).map(t => t.text);
    const size = tokensInfo.length;

    const getHeatmapColor = (score: number) => {
        // Math: interpolate between #0a0a14 and #7c6af5
        // Dark bg: R=10, G=10, B=20
        // Purple: R=124, G=106, B=245
        const r = Math.round(10 + score * 114);
        const g = Math.round(10 + score * 96);
        const b = Math.round(20 + score * 225);
        return `rgb(${r},${g},${b})`;
    };

    const simulatedTokens = result.tokens.slice(0, 8);
    const matrix = isReal ? realAttention : Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => {
            if (i === j) return 0.8; // Self attention high
            // Some random glowing connections
            const randomConn = Math.random();
            if (randomConn > 0.7) return Math.max(0, 0.4 - Math.abs(i - j) * 0.1) + Math.random() * 0.4;
            return 0.05; // Base low noise
        })
    );

    // Node plotting math for circular graph
    const svgSize = 400;
    const center = svgSize / 2;
    const radius = 140;

    const nodes = tokensInfo.map((text, i) => {
        const angle = (i / size) * 2 * Math.PI - Math.PI / 2; // Start from top
        return {
            x: center + radius * Math.cos(angle),
            y: center + radius * Math.sin(angle),
            text: text.replace(/ /g, '·')
        };
    });

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="mb-2 p-4 border border-blue-500/30 bg-blue-500/10 rounded-lg text-blue-200 text-sm leading-relaxed">
                <h3 className="font-bold flex items-center gap-2 mb-1 text-blue-400">
                    <span className="text-xl">💡</span> Connecting Friends
                </h3>
                <p>
                    When reading your sentence, the robot looks at EVERY word at the exact same moment. It tries to see which words are best friends! If two words shine super brightly in the boxes below, it means the robot thinks those two words need to stay glued together so the story makes sense!
                </p>
            </div>

            <div className="flex justify-between items-start mt-2">
                <div>
                    <h2 className="text-lg font-semibold flex items-center gap-3">
                        Attention Heatmap
                        {isReal ? (
                            <span className="text-xs bg-neon-purple/20 text-neon-purple px-2 py-1 rounded border border-neon-purple">
                                Real BERT Layer 6 Attention
                            </span>
                        ) : (
                            <span className="text-xs bg-dark-bg text-gray-400 px-2 py-1 rounded border border-dark-border">
                                Simulated Visualization
                            </span>
                        )}
                    </h2>
                    {!isReal && (
                        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
                            These bright spots are pretend (showing only the first 8 blocks).
                            You can ask a real robot to play the connecting game using the BERT endpoint!
                        </p>
                    )}
                    {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                </div>

                {!isReal && model === 'bert-base-uncased' && (
                    <button
                        onClick={fetchRealAttention}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-neon-purple hover:bg-neon-pink rounded text-white font-medium transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        Load Real BERT Attention
                    </button>
                )}
            </div>

            <div className="flex flex-col items-center justify-center p-8 bg-[#0a0f18] border-2 border-[#1e293b] rounded-2xl shadow-inner mt-4 overflow-hidden relative">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00ffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                <h3 className="text-neon-cyan/50 font-mono tracking-widest uppercase text-xs absolute top-4 left-4 border border-neon-cyan/20 px-2 py-1 rounded">Neural Web Interface</h3>

                <svg width="100%" height="400" viewBox="0 0 400 400" className="max-w-[400px] overflow-visible z-10">

                    {/* Draw Glowing Connections (Edges) */}
                    {matrix.map((row, i) =>
                        row.map((score, j) => {
                            if (score < 0.15 || i === j) return null; // Only draw strong external connections to avoid messy UI
                            const strokeOpacity = Math.min(score * 1.5, 1);
                            const thickness = 1 + score * 4;

                            return (
                                <path
                                    key={`edge-${i}-${j}`}
                                    d={`M ${nodes[i].x} ${nodes[i].y} Q ${center} ${center} ${nodes[j].x} ${nodes[j].y}`}
                                    fill="none"
                                    stroke="#00ffff"
                                    strokeWidth={thickness}
                                    strokeOpacity={strokeOpacity}
                                    className="transition-all duration-500 ease-in-out hover:stroke-neon-pink hover:stroke-opacity-100 cursor-crosshair drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]"
                                >
                                    <title>'{tokensInfo[i]}' thinks '{tokensInfo[j]}' is important! (Score: {(score * 100).toFixed(0)}%)</title>
                                </path>
                            );
                        })
                    )}

                    {/* Draw Nodes (Tokens) */}
                    {nodes.map((n, i) => (
                        <g key={`node-${i}`} className="group cursor-help transition-transform hover:scale-110" style={{ transformOrigin: `${n.x}px ${n.y}px` }}>
                            {/* Outer Glow */}
                            <circle cx={n.x} cy={n.y} r="26" fill="rgba(124,106,245,0.2)" className="group-hover:fill-neon-pink/30 animate-pulse" />
                            {/* Inner Circle / Base */}
                            <circle cx={n.x} cy={n.y} r="20" fill="#12122a" stroke="#7c6af5" strokeWidth="3" className="group-hover:stroke-neon-pink transition-colors drop-shadow-[0_0_10px_rgba(124,106,245,0.6)]" />
                            {/* Text Value */}
                            <text x={n.x} y={n.y + 4} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold" className="font-mono pointer-events-none drop-shadow-md tracking-wider">
                                {n.text.length > 5 ? n.text.substring(0, 4) + '..' : n.text}
                            </text>

                            {/* Hover Tooltip/Label */}
                            <g className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <rect x={n.x - 40} y={n.y - 50} width="80" height="20" fill="#000" rx="4" opacity="0.8" stroke="#00ffff" strokeWidth="1" />
                                <text x={n.x} y={n.y - 36} textAnchor="middle" fill="#00ffff" fontSize="10" className="font-mono pointer-events-none">"{n.text}"</text>
                            </g>
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
}
