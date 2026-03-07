import { useState } from 'react'
import { useTokenizerStore } from '@/store/tokenizerStore'
import { SAMPLE_TEXTS } from '@/types'
import { Loader2, Sparkles } from 'lucide-react'
import StatsBar from '@/components/StatsBar'
import TokenDisplay from '@/components/TokenDisplay'
import RawSequence from '@/components/RawSequence'

export default function App() {
    const { input, model, result, loading, error, setInput, setModel, tokenize, reset } = useTokenizerStore()
    const [activeTab, setActiveTab] = useState<'tokens' | 'raw'>('tokens')

    const handleSampleText = (text: string) => {
        setInput(text)
    }

    return (
        <div className="min-h-screen bg-[#020617] text-[#F8FAFC]">
            {/* Header */}
            <header className="border-b border-[#1E293B] bg-gradient-to-r from-[#0d0d1f] to-[#141428] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7c6af5] via-[#f56a9a] to-[#6af5a0]"></div>
                <div className="container mx-auto px-6 py-8 relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="w-8 h-8 text-[#7c6af5] drop-shadow-[0_0_8px_rgba(124,106,245,0.8)]" />
                        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#7c6af5] to-[#f56a9a]">
                            Brains & Tokens: Deep Dive
                        </h1>
                    </div>
                    <p className="text-[#94a3b8] font-medium text-sm tracking-wide uppercase">
                        Interactive BPE Tokenization Explorer
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-[1100px]">
                {/* Input Section */}
                <div className="card mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-[#7c6af5] uppercase tracking-widest">✏️ Enter Your Text</h2>
                        <div className="flex items-center gap-4">
                            <select
                                value={model}
                                onChange={(e) => setModel(e.target.value as 'gpt2' | 'bert-base-uncased')}
                                className="bg-[#1a1a2e] border border-[#2a2a4a] text-[#e0e0e0] rounded-lg px-4 py-2 text-sm outline-none cursor-pointer hover:border-[#7c6af5] transition-colors"
                            >
                                <option value="gpt2">GPT-2 (50,257 tokens)</option>
                                <option value="bert-base-uncased">BERT (30,522 tokens)</option>
                            </select>
                        </div>
                    </div>

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type or paste any text to see how the model processes it..."
                        className="glass-input h-36"
                        maxLength={2000}
                    />

                    <div className="flex flex-wrap items-center justify-between mt-5 gap-4">
                        <div className="flex flex-wrap gap-3">
                            {SAMPLE_TEXTS.map((sample) => (
                                <button
                                    key={sample.name}
                                    onClick={() => handleSampleText(sample.text)}
                                    className="btn-secondary text-xs"
                                >
                                    {sample.name}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={reset}
                                className="btn-secondary"
                                disabled={loading}
                            >
                                Reset
                            </button>
                            <button
                                onClick={tokenize}
                                disabled={loading || !input.trim()}
                                className="btn-primary flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Tokenizing...
                                    </>
                                ) : (
                                    'Tokenize'
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
                            {error}
                        </div>
                    )}

                    <div className="mt-4 text-sm text-gray-400">
                        <span>{input.length} / 2000 characters</span>
                    </div>
                </div>

                {/* Stats Bar */}
                {result && (
                    <div className="mb-6">
                        <StatsBar result={result} />
                    </div>
                )}

                {/* Tabs */}
                {result && (
                    <div className="mb-6">
                        <div className="flex gap-2 border-b border-[#1E293B]">
                            <button
                                onClick={() => setActiveTab('tokens')}
                                className={`px-4 py-2 font-medium transition-colors ${activeTab === 'tokens'
                                    ? 'text-[#7c6af5] border-b-2 border-[#7c6af5] shadow-[inset_0_-2px_0_0_#7c6af5]'
                                    : 'text-[#94a3b8] hover:text-white'
                                    }`}
                            >
                                Token Visualization
                            </button>
                            <button
                                onClick={() => setActiveTab('raw')}
                                className={`px-4 py-2 font-medium transition-colors ${activeTab === 'raw'
                                    ? 'text-[#7c6af5] border-b-2 border-[#7c6af5] shadow-[inset_0_-2px_0_0_#7c6af5]'
                                    : 'text-[#94a3b8] hover:text-white'
                                    }`}
                            >
                                Raw Sequence
                            </button>
                        </div>
                    </div>
                )}

                {/* Tab Content */}
                {result && (
                    <div>
                        {activeTab === 'tokens' && <TokenDisplay />}
                        {activeTab === 'raw' && <RawSequence result={result} />}
                    </div>
                )}

                {/* Empty State */}
                {!result && !loading && (
                    <div className="card text-center py-16 relative overflow-hidden flex flex-col items-center justify-center">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,106,245,0.05)_0%,transparent_70%)] pointer-events-none"></div>
                        <Sparkles className="w-16 h-16 text-[#7c6af5] mb-6 drop-shadow-[0_0_8px_rgba(124,106,245,0.5)]" />
                        <h3 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#7c6af5] to-[#f56a9a]">Ready to Tokenize</h3>
                        <p className="text-[#94a3b8] mb-8 max-w-md mx-auto leading-relaxed">
                            Enter some text above or choose a sample to see how LLMs break down text into tokens using BPE.
                        </p>
                        <div className="flex justify-center gap-6 text-sm text-[#94a3b8] font-mono">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#7c6af5] shadow-[0_0_8px_#7c6af5]"></span>
                                <span>Word</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#f5c96a] shadow-[0_0_8px_#f5c96a]"></span>
                                <span>Subword</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#f56a7c] shadow-[0_0_8px_#f56a7c]"></span>
                                <span>Punctuation</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#6ac8f5] shadow-[0_0_8px_#6ac8f5]"></span>
                                <span>Special</span>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-[#1E293B] mt-12 bg-[#020617]">
                <div className="container mx-auto px-4 py-8 text-center text-[#94a3b8] text-sm">
                    <p>Powered by Real Tokenizers: GPT-2 and BERT</p>
                    <p className="mt-2 text-[#475569]">A Deep Dive into the mechanics of LLMs.</p>
                </div>
            </footer>
        </div>
    )
}
