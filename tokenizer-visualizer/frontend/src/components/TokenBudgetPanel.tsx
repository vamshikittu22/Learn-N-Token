import React from 'react';
import { useTokenizerStore } from '../store/tokenizerStore';
import { Cpu } from 'lucide-react';

export default function TokenBudgetPanel() {
    const { result } = useTokenizerStore();

    if (!result || !result.context_window_usage) {
        return (
            <div className="p-8 text-center text-gray-400">
                Context window data is not available for this model/request.
            </div>
        );
    }

    const usageData = [
        { model: 'GPT-2', label: '1,024 Tokens', key: 'gpt2', max: 1024 },
        { model: 'GPT-3.5', label: '4,096 Tokens', key: 'gpt35', max: 4096 },
        { model: 'GPT-4', label: '8,192 Tokens', key: 'gpt4', max: 8192 },
        { model: 'GPT-4 32K', label: '32,768 Tokens', key: 'gpt4_32k', max: 32768 },
        { model: 'LLaMA-3', label: '131,072 Tokens', key: 'llama3', max: 131072 }
    ];

    const getBatteryColor = (percentage: number) => {
        if (percentage > 75) return 'from-red-500 to-red-700 shadow-[0_0_30px_rgba(239,68,68,0.6)]';
        if (percentage > 25) return 'from-neon-yellow to-orange-500 shadow-[0_0_30px_rgba(245,201,106,0.6)]';
        return 'from-neon-green to-emerald-500 shadow-[0_0_30px_rgba(106,245,160,0.6)]';
    };

    const getTextColor = (percentage: number) => {
        if (percentage > 75) return 'text-red-400';
        if (percentage > 25) return 'text-neon-yellow';
        return 'text-neon-green';
    };

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="flex items-center gap-4 mb-4 bg-dark-bg p-4 rounded-xl border-2 border-dark-border">
                <div className="p-4 bg-gradient-to-br from-neon-purple to-neon-pink rounded-full shadow-[0_0_20px_rgba(124,106,245,0.4)]">
                    <Cpu className="w-8 h-8 text-white relative z-10" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider drop-shadow-md">Robot Memory Batteries</h2>
                    <p className="text-sm text-gray-400 mt-1 font-mono">
                        Power Core Status Visualizer
                    </p>
                </div>
            </div>

            <div className="mb-4 p-4 border border-blue-500/30 bg-blue-500/10 rounded-lg text-blue-200 text-sm leading-relaxed">
                <h3 className="font-bold flex items-center gap-2 mb-1 text-blue-400">
                    <span className="text-xl">💡</span> Robot Memory Limits
                </h3>
                <p>
                    Robots have a very strict limit on how much they can remember at one time (called a "Context Window"). If you tell them a story that has too many blocks, their brain gets full, and they totally forget the beginning of the story! Below you can see how full different robot brains got from your text.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
                {usageData.map((item) => {
                    const rawPercentage = result.context_window_usage![item.key] || 0;
                    // Visual height minimum 4% so battery isn't completely empty visually if > 0
                    const visualHeight = rawPercentage > 0 ? Math.max(4, Math.min(100, rawPercentage)) : 0;

                    return (
                        <div key={item.key} className="bg-[#0a0f18] border-2 border-[#1e293b] rounded-2xl p-6 relative flex flex-col items-center group hover:border-[#45a29e] transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(0,255,255,0.1)]">
                            {/* Screw details */}
                            <div className="absolute top-3 left-3 w-2 h-2 rounded-full border border-gray-600 bg-gray-800 shadow-inner"></div>
                            <div className="absolute top-3 right-3 w-2 h-2 rounded-full border border-gray-600 bg-gray-800 shadow-inner"></div>
                            <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full border border-gray-600 bg-gray-800 shadow-inner"></div>
                            <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full border border-gray-600 bg-gray-800 shadow-inner"></div>

                            {/* Core Label */}
                            <div className="text-neon-cyan font-mono font-black text-2xl uppercase tracking-widest drop-shadow-[0_0_5px_rgba(0,255,255,0.5)] mt-2">
                                {item.model}
                            </div>
                            <div className="text-gray-400 text-xs font-mono uppercase tracking-widest mb-6 border-b border-gray-700/50 pb-2 w-full text-center">
                                Max Limit: {item.max.toLocaleString()}
                            </div>

                            {/* Battery Container */}
                            <div className="w-24 h-48 bg-[#1f2833] rounded-t-sm rounded-b-xl border-[6px] border-[#0b0c10] shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] relative flex items-end overflow-hidden mb-6">
                                {/* Battery Terminal Cap */}
                                <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-8 h-2 bg-gray-500 rounded-t-md"></div>

                                {/* Background Grid inside Battery */}
                                <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '8px 8px' }}></div>

                                {/* Battery Liquid/Charge */}
                                <div
                                    className={`w-full bg-gradient-to-t ${getBatteryColor(rawPercentage)} transition-all duration-[1.5s] ease-out relative`}
                                    style={{ height: `${visualHeight}%` }}
                                >
                                    {/* Animated top surface wave / glow */}
                                    <div className="absolute top-0 left-0 right-0 h-3 bg-white/40 backdrop-blur-sm shadow-[0_-5px_15px_rgba(255,255,255,0.6)] animate-pulse"></div>
                                    {/* Bubble effects */}
                                    <div className="absolute bottom-2 left-2 w-2 h-2 bg-white/20 rounded-full animate-bounce"></div>
                                    <div className="absolute bottom-6 right-3 w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>

                            {/* Digital Readout Screen */}
                            <div className="bg-black border-2 border-[#1e293b] px-6 py-3 rounded-lg flex flex-col items-center w-full relative overflow-hidden group-hover:border-neon-cyan/50 transition-colors">
                                {/* Scanline overlay */}
                                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none"></div>

                                <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1 z-10">Power Consumed</span>
                                <span className={`text-2xl font-mono font-black ${getTextColor(rawPercentage)} drop-shadow-[0_0_8px_currentColor] z-10 tracking-wider`}>
                                    {rawPercentage.toFixed(3)}<span className="text-sm">%</span>
                                </span>
                                <span className="text-gray-600 font-mono text-xs mt-1 z-10 font-bold">{result.total_tokens} Blks</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
