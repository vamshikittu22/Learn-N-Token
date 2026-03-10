import React, { useState, useMemo } from 'react';
import { useTokenizerStore } from '../store/tokenizerStore';
import { TokenInfo } from '../types';
import { ArrowUpDown } from 'lucide-react';

type SortKey = 'id' | 'display' | 'type' | 'frequency';

export default function VocabTable() {
    const { result, selectToken, setActiveTab } = useTokenizerStore();
    const [sortKey, setSortKey] = useState<SortKey>('frequency');
    const [sortDesc, setSortDesc] = useState(true);
    const [filter, setFilter] = useState('');

    const uniqueTokensMap = useMemo(() => {
        if (!result) return new Map<number, TokenInfo>();
        const m = new Map<number, TokenInfo>();
        result.tokens.forEach(t => {
            if (!m.has(t.id)) m.set(t.id, t);
        });
        return m;
    }, [result]);

    const sortedData = useMemo(() => {
        if (!result) return [];
        let list = Array.from(uniqueTokensMap.values());

        if (filter) {
            list = list.filter(t => t.text.toLowerCase().includes(filter.toLowerCase()) || t.display.toLowerCase().includes(filter.toLowerCase()));
        }

        list.sort((a, b) => {
            let valA: any = a[sortKey];
            let valB: any = b[sortKey];

            if (typeof valA === 'string') {
                const res = valA.localeCompare(valB);
                return sortDesc ? -res : res;
            }
            return sortDesc ? valB - valA : valA - valB;
        });
        return list;
    }, [uniqueTokensMap, sortKey, sortDesc, filter, result]);

    if (!result) return null;

    const maxFreq = sortedData.length > 0 ? Math.max(...sortedData.map(t => t.frequency)) : 1;

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDesc(!sortDesc);
        } else {
            setSortKey(key);
            setSortDesc(true);
        }
    };

    const handleRowClick = (id: number) => {
        selectToken(id);
        setActiveTab('tokens');
    };

    const getTypeStyle = (type: string) => {
        switch (type) {
            case 'word': return 'bg-neon-purple/20 text-neon-purple border-neon-purple';
            case 'subword': return 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow';
            case 'punctuation': return 'bg-neon-pink/20 text-neon-pink border-neon-pink';
            case 'number': return 'bg-neon-green/20 text-neon-green border-neon-green';
            default: return 'bg-gray-800 text-gray-400 border-gray-600';
        }
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="mb-2 p-4 border border-blue-500/30 bg-blue-500/10 rounded-lg text-blue-200 text-sm leading-relaxed">
                <h3 className="font-bold flex items-center gap-2 mb-1 text-blue-400">
                    <span className="text-xl">💡</span> The Robot's Dictionary
                </h3>
                <p>
                    Imagine the robot has a giant secret dictionary book with 50,000 words inside. Every time you type a word, the robot finds it in the book to see what Secret Number it belongs to. Below is a tally of every page in the dictionary we used to read your text!
                </p>
            </div>

            <div className="flex justify-between items-center mb-2 mt-2">
                <h2 className="text-lg font-semibold text-gray-300">The Dictionary Counts</h2>
                <input
                    type="text"
                    placeholder="Filter tokens..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-dark-input border border-dark-border rounded px-3 py-1.5 text-sm outline-none focus:border-neon-purple transition-colors w-64"
                />
            </div>

            {/* Flashcard Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {sortedData.map(t => (
                    <div
                        key={t.id}
                        onClick={() => handleRowClick(t.id)}
                        className="relative group bg-dark-bg border border-dark-border hover:border-neon-cyan/50 p-5 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,255,255,0.15)] flex flex-col justify-between overflow-hidden shadow-lg"
                    >
                        {/* Decorative Background Glow */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-neon-purple/20 to-transparent rounded-bl-full opacity-30 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        {/* Top Info Row */}
                        <div className="flex justify-between items-start mb-4 z-10 relative">
                            <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-sm border shadow-sm ${getTypeStyle(t.type)}`}>
                                {t.type}
                            </span>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Times Seen</span>
                                <span className="text-neon-cyan font-mono font-bold text-2xl leading-none mt-1">{t.frequency}<span className="text-[10px] text-gray-500 ml-0.5 relative -top-1">x</span></span>
                            </div>
                        </div>

                        {/* Middle Word Display */}
                        <div className="flex-grow flex flex-col items-center justify-center my-6 z-10 relative">
                            <span className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold">The Word Block</span>
                            <div className="bg-[#0f0f18] px-4 py-2 border border-white/5 rounded-lg shadow-inner flex items-center justify-center w-full max-w-[200px]">
                                <span className="font-mono text-2xl font-black text-white drop-shadow-md break-all text-center">
                                    {t.display.replace(/ /g, '·')}
                                </span>
                            </div>
                        </div>

                        {/* Bottom Secret ID Row */}
                        <div className="mt-auto pt-3 border-t border-dark-border/60 flex justify-between items-end z-10 relative">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Secret Vault ID</span>
                                <span className="font-mono text-neon-pink font-extrabold text-2xl drop-shadow-[0_0_8px_rgba(255,107,255,0.4)]">{t.id}</span>
                            </div>
                            <div className="flex flex-col items-end text-right">
                                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Page Rank</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-12 h-1.5 bg-dark-card rounded-full overflow-hidden">
                                        <div
                                            className="bg-neon-yellow h-full rounded-full"
                                            style={{ width: `${(t.frequency / maxFreq) * 100}%` }}
                                        />
                                    </div>
                                    <span className="font-mono text-gray-400 text-xs font-bold w-8">{((t.frequency / result.total_tokens) * 100).toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {sortedData.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 text-center bg-dark-bg border border-dark-border rounded-xl border-dashed">
                        <span className="text-4xl mb-4 opacity-50">🔍</span>
                        <h3 className="text-gray-300 font-bold mb-1">No blocks found!</h3>
                        <p className="text-gray-500 text-sm">Try searching for a different word in the scrapbook.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
