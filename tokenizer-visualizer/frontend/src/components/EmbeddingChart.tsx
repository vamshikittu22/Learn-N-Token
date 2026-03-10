import React, { useMemo } from 'react';
import { useTokenizerStore } from '../store/tokenizerStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

export default function EmbeddingChart() {
    const { result } = useTokenizerStore();

    const radarData = useMemo(() => {
        if (!result || !result.embeddings) return [];

        const topEmbeddings = [...result.embeddings].slice(0, 6);
        const colors = ['#7c6af5', '#f56a9a', '#6af5a0', '#f5c96a', '#6ac8f5', '#f5896a'];

        // Find min/max to perfectly scale dots across the radar surface
        let minX = 0, maxX = 0, minY = 0, maxY = 0;
        topEmbeddings.forEach(emb => {
            const x = emb.vector[0] || 0;
            const y = emb.vector[1] || 0;
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        });

        // Add 20% padding so dots don't sit exactly on the rim
        const rangeX = (maxX - minX) || 1;
        const rangeY = (maxY - minY) || 1;
        const bMinX = minX - rangeX * 0.2;
        const bMaxX = maxX + rangeX * 0.2;
        const bMinY = minY - rangeY * 0.2;
        const bMaxY = maxY + rangeY * 0.2;

        return topEmbeddings.map((emb, idx) => {
            const rawX = emb.vector[0] || 0;
            const rawY = emb.vector[1] || 0;

            const clampX = (rawX - bMinX) / (bMaxX - bMinX);
            const clampY = (rawY - bMinY) / (bMaxY - bMinY);

            // Stagger labels to prevent overlap (TopRight, BottomRight, BottomLeft, TopLeft)
            const labelPositions = [
                { top: '-2rem', left: '1.5rem' }, // TR
                { top: '1.5rem', left: '1.5rem' }, // BR
                { top: '1.5rem', left: '-5rem' }, // BL
                { top: '-2rem', left: '-5rem' }, // TL
                { top: '-3rem', left: '-1rem' }, // T
                { top: '2.5rem', left: '-1rem' }  // B
            ];
            const lPos = labelPositions[idx % labelPositions.length];

            return {
                name: emb.token_text,
                xPercent: clampX * 100,
                yPercent: clampY * 100, // invert Y for screen coords
                realX: parseFloat(rawX.toFixed(3)),
                realY: parseFloat(rawY.toFixed(3)),
                color: colors[idx % colors.length],
                lPos
            };
        });
    }, [result]);

    if (!result || !result.embeddings) {
        return (
            <div className="p-8 text-center text-gray-400">
                Embeddings not included or not supported for this model.
            </div>
        );
    }



    return (
        <div className="w-full flex flex-col gap-4">
            <div className="mb-2 p-4 border border-blue-500/30 bg-blue-500/10 rounded-lg text-blue-200 text-sm leading-relaxed">
                <h3 className="font-bold flex items-center gap-2 mb-1 text-blue-400">
                    <span className="text-xl">💡</span> The Brain Map
                </h3>
                <p>
                    How does a robot know what words mean? It gets a giant treasure map! When it sees a block, it puts a pin on the map. Words that mean the same thing (like "cat" and "dog") get pinned right next to each other! These bars show the math secret coordinates used to plot the points.
                </p>
            </div>

            <div className="mt-2">
                <h2 className="text-lg font-semibold flex items-center gap-3">
                    The Radar Screen (Dimensions 1 & 2)
                    <span className="text-xs bg-[#111122] text-neon-pink px-2 py-1 rounded border border-neon-pink/30 uppercase tracking-widest font-mono shadow-[0_0_10px_rgba(255,107,255,0.2)]">
                        Deep Scan Active
                    </span>
                </h2>
                <p className="text-sm text-gray-500 max-w-3xl mt-1">
                    These are simulated values showing how the robot plots these words on its giant map. The full map usually has {result.embeddings[0]?.full_dim || 768} crazy dimensions! Showing map locations for the top 6 tokens.
                </p>
            </div>

            {/* Radar Viewport */}
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center p-8 bg-[#0a0f18] border-2 border-[#1e293b] rounded-2xl shadow-inner mt-4 overflow-hidden relative">

                {/* Background Grid Accent */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                {/* The Circular Radar Map */}
                <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full border border-neon-cyan/30 flex-shrink-0 bg-[#050510] shadow-[0_0_40px_rgba(0,255,255,0.1)]">
                    {/* Concentric Radar Rings */}
                    <div className="absolute inset-4 rounded-full border border-neon-cyan/20"></div>
                    <div className="absolute inset-12 rounded-full border border-neon-cyan/20"></div>
                    <div className="absolute inset-24 rounded-full border border-neon-cyan/10"></div>
                    <div className="absolute inset-32 rounded-full border border-neon-cyan/5"></div>

                    {/* Crosshairs */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-neon-cyan/30"></div>
                    <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-neon-cyan/30"></div>

                    {/* Radar Sweep Animation (CSS Spin) */}
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-neon-cyan/80 animate-[spin_4s_linear_infinite] opacity-50 blur-[2px]"></div>

                    {/* The Plotted Tokens */}
                    {radarData.map((d, i) => (
                        <div
                            key={`radar-point-${i}`}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-crosshair z-10"
                            style={{
                                left: `${d.xPercent}%`,
                                top: `${d.yPercent}%`
                            }}
                        >
                            {/* Glowing Core Dot */}
                            <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: d.color, boxShadow: `0 0 15px 4px ${d.color}80` }}></div>

                            {/* Sonar Ripple */}
                            <div className="absolute inset-0 w-3 h-3 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ backgroundColor: d.color }}></div>

                            {/* Callout Label with Staggered Positioning to Prevent Overlap */}
                            <div className="absolute px-2 py-1 bg-[#111122]/90 border rounded text-xs font-mono tracking-widest text-shadow-md backdrop-blur-md transition-all group-hover:scale-110 group-hover:z-30 pointer-events-none shadow-[0_5px_15px_rgba(0,0,0,0.8)]" style={{
                                borderColor: `${d.color}80`,
                                color: d.color,
                                top: d.lPos.top,
                                left: d.lPos.left,
                                zIndex: 20
                            }}>
                                {/* Connector Line */}
                                <div className="absolute w-4 h-[1px] bg-white/20" style={{
                                    top: d.lPos.top.startsWith('-') ? '100%' : '0%',
                                    left: d.lPos.left.startsWith('-') ? '100%' : '0%',
                                    transform: `rotate(${d.lPos.top.startsWith('-') ? (d.lPos.left.startsWith('-') ? '45deg' : '-45deg') : (d.lPos.left.startsWith('-') ? '-45deg' : '45deg')})`,
                                    transformOrigin: d.lPos.top.startsWith('-') ? (d.lPos.left.startsWith('-') ? 'bottom right' : 'bottom left') : (d.lPos.left.startsWith('-') ? 'top right' : 'top left'),
                                    borderColor: d.color
                                }}></div>
                                {d.name}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Data Terminal Cards */}
                <div className="flex flex-col gap-3 w-full md:w-64 z-10">
                    <h4 className="text-neon-cyan font-mono text-sm uppercase tracking-widest mb-2 border-b border-neon-cyan/20 pb-1">Coordinates</h4>
                    {radarData.map((d, i) => (
                        <div key={`term-${i}`} className="flex justify-between items-center p-2.5 bg-[#111122] border rounded-lg hover:bg-[#1a1a33] transition-colors" style={{ borderColor: `${d.color}40` }}>
                            <span className="font-bold text-white px-2 py-0.5 rounded bg-black/50 overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]" style={{ color: d.color }}>{d.name.replace(/ /g, '·')}</span>
                            <div className="flex gap-2 font-mono text-xs">
                                <span className="px-1.5 py-0.5 bg-black/50 rounded flex gap-1">
                                    <span className="text-gray-500">X</span>
                                    <span className="text-gray-300">{d.realX > 0 ? '+' : ''}{d.realX}</span>
                                </span>
                                <span className="px-1.5 py-0.5 bg-black/50 rounded flex gap-1">
                                    <span className="text-gray-500">Y</span>
                                    <span className="text-gray-300">{d.realY > 0 ? '+' : ''}{d.realY}</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
