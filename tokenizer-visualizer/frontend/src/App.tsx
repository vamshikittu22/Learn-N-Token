import React from 'react';
import { useTokenizerStore } from './store/tokenizerStore';
import { ModelSelection, TabType } from './types';
import StatsBar from './components/StatsBar';
import TokenDisplay from './components/TokenDisplay';
import RawSequence from './components/RawSequence';
import VocabTable from './components/VocabTable';
import EmbeddingChart from './components/EmbeddingChart';
import AttentionHeatmap from './components/AttentionHeatmap';
import BPEAnimation from './components/BPEAnimation';
import TokenBudgetPanel from './components/TokenBudgetPanel';
import PipelineDiagram from './components/PipelineDiagram';
import { Brain, ExternalLink, Columns, Loader2 } from 'lucide-react';

const SAMPLES = [
    { name: 'Story', text: 'The neon lights of the city reflected in the puddle. She tightened her coat.' },
    { name: 'Code', text: 'function calculateSum(a: number, b: number) {\n  return a + b;\n}' },
    { name: 'RAG Document', text: 'Title: Q4 Earnings Report. Revenue grew by 15% year-over-year, driven by cloud.' },
    { name: 'Code+Math', text: 'Let $x = \\sum_{i=1}^{n} i^2$. def sq_sum(n): return sum(i*i for i in range(1, n+1))' }
];

const MODELS: { value: ModelSelection, label: string, vocabSize: number }[] = [
    { value: 'gpt2', label: 'GPT-2', vocabSize: 50257 },
    { value: 'bert-base-uncased', label: 'BERT Base', vocabSize: 30522 },
    { value: 'gpt4', label: 'GPT-4 (tiktoken)', vocabSize: 100277 }
];

const TABS: { id: TabType, label: string }[] = [
    { id: 'tokens', label: 'LEGO Blocks' },
    { id: 'raw', label: 'Secret IDs' },
    { id: 'vocab', label: 'Dictionary' },
    { id: 'embeddings', label: 'Brain Maps' },
    { id: 'attention', label: 'Connecting Words' },
    { id: 'bpe', label: 'Merging Game' },
    { id: 'budget', label: 'Robot Memory' }
];

export default function App() {
    const {
        input, setInput, model, setModel, loading, error, result,
        activeTab, setActiveTab, tokenize, compareMode, toggleCompareMode,
        compareInput, setCompareInput, runComparison, compareResult
    } = useTokenizerStore();

    const handleTokenize = () => {
        if (compareMode) {
            runComparison();
        } else {
            tokenize();
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center pb-20">
            {/* Header */}
            <header className="w-full border-b border-dark-border bg-dark-card py-4 px-6 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <Brain className="text-neon-purple w-8 h-8" />
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
                            Learn'N'Token
                        </h1>
                        <p className="text-xs text-gray-400">LLM Tokenizer Visualizer</p>
                    </div>
                </div>
                <a href="https://github.com/vamshikittu22/Learn-N-Token" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <ExternalLink className="w-5 h-5" />
                </a>
            </header>

            <main className="w-full max-w-6xl px-6 mt-8 flex flex-col gap-6">
                {/* Model Selection */}
                <div className="flex flex-wrap gap-4">
                    {MODELS.map(m => (
                        <button
                            key={m.value}
                            onClick={() => setModel(m.value)}
                            className={`flex flex-col items-center justify-center flex-1 py-3 px-4 rounded-lg border text-center transition-all ${model === m.value
                                ? 'border-neon-purple bg-neon-purple/10 text-white'
                                : 'border-dark-border bg-dark-card text-gray-400 hover:border-gray-500'
                                }`}
                        >
                            <span className="font-semibold whitespace-nowrap">{m.label}</span>
                            <span className="text-xs opacity-70 mt-1 whitespace-nowrap">Vocab: {m.vocabSize.toLocaleString()}</span>
                        </button>
                    ))}
                </div>

                {/* Input Area */}
                <div className={`grid gap-6 ${compareMode ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-semibold text-gray-300">
                                {compareMode ? 'Text 1' : 'Input Text'}
                            </label>
                            {!compareMode && (
                                <div className="flex gap-2">
                                    {SAMPLES.map(s => (
                                        <button key={s.name} onClick={() => setInput(s.text)} className="text-xs px-2 py-1 rounded bg-dark-card border border-dark-border hover:border-neon-purple transition-colors">
                                            {s.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter text here to see how it is tokenized..."
                            className="w-full h-40 bg-dark-input border border-dark-border rounded-lg p-4 font-mono text-sm resize-none outline-none glowing-input"
                        />
                    </div>

                    {compareMode && (
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-semibold text-gray-300">Text 2</label>
                            <textarea
                                value={compareInput}
                                onChange={(e) => setCompareInput(e.target.value)}
                                placeholder="Enter second text to compare..."
                                className="w-full h-40 bg-dark-input border border-dark-border rounded-lg p-4 font-mono text-sm resize-none outline-none glowing-input"
                            />
                        </div>
                    )}
                </div>

                {!input.trim() && !compareMode && (
                    <div className="w-full mt-8 p-10 bg-dark-card border border-dark-border rounded-xl flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
                        <div className="w-16 h-16 bg-neon-purple/20 rounded-full flex items-center justify-center mb-6 border border-neon-purple/40">
                            <Brain className="w-8 h-8 text-neon-purple animate-pulse" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-4">
                            How do Neural Networks read text?
                        </h2>
                        <p className="max-w-2xl text-gray-400 leading-relaxed mb-4 text-lg">
                            Large Language Models (like GPT-4 and Claude) don't process language word-by-word.
                            Instead, they break text down into <span className="text-neon-pink font-semibold">Tokens</span>—sub-word chunks that represent common root structures.
                        </p>

                        <PipelineDiagram />

                        <div className="mt-2 text-sm text-gray-500 italic">
                            Select a sample preset above or type your own text to begin the visualizer.
                        </div>
                    </div>
                )}

                {/* Submit Block */}
                <div className="relative">
                    {(!input.trim() || (compareMode && !compareInput.trim())) && input.trim().length > 0 && (
                        <div className="absolute -top-10 left-0 w-full text-center text-sm font-semibold text-red-500">
                            Both fields must be filled to run a comparison.
                        </div>
                    )}
                    <button
                        onClick={handleTokenize}
                        disabled={loading || !input.trim() || (compareMode && !compareInput.trim())}
                        className="w-full mt-4 py-4 rounded-lg bg-neon-purple hover:bg-neon-pink text-white font-bold text-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin w-6 h-6" /> : 'Run Tokenization'}
                    </button>
                </div>

                {error && (
                    <div className="w-full p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                        {error}
                    </div>
                )}

                {/* Results Area */}
                {result && !compareMode && (
                    <div className="flex flex-col gap-6 mt-8 animate-in fade-in duration-500">
                        <PipelineDiagram input={input} tokens={result.tokens} rawIds={result.raw_ids} />

                        <StatsBar />

                        <div className="flex border-b border-dark-border overflow-x-auto hide-scrollbar">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-3 whitespace-nowrap font-medium transition-colors border-b-2 ${activeTab === tab.id
                                        ? 'border-neon-purple text-neon-purple'
                                        : 'border-transparent text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="bg-dark-card border border-dark-border rounded-xl p-6 min-h-[400px]">
                            {activeTab === 'tokens' && <TokenDisplay />}
                            {activeTab === 'raw' && <RawSequence />}
                            {activeTab === 'vocab' && <VocabTable />}
                            {activeTab === 'embeddings' && <EmbeddingChart />}
                            {activeTab === 'attention' && <AttentionHeatmap />}
                            {activeTab === 'bpe' && <BPEAnimation />}
                            {activeTab === 'budget' && <TokenBudgetPanel />}
                        </div>
                    </div>
                )}

                {/* Compare Results Area */}
                {compareResult && compareMode && (
                    <div className="bg-dark-card border border-dark-border rounded-xl p-6 mt-8 animate-in fade-in duration-500">
                        <h2 className="text-xl font-bold mb-4 text-neon-cyan">Comparison Results</h2>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg mb-2">Text 1 Stats</h3>
                                <p>Tokens: <span className="text-neon-purple text-xl">{compareResult.text1_token_count}</span></p>
                                <p>Efficiency: {compareResult.text1_efficiency_ratio} tokens/word</p>
                            </div>
                            <div>
                                <h3 className="text-lg mb-2">Text 2 Stats</h3>
                                <p>Tokens: <span className="text-neon-pink text-xl">{compareResult.text2_token_count}</span></p>
                                <p>Efficiency: {compareResult.text2_efficiency_ratio} tokens/word</p>
                            </div>
                        </div>
                        <div className="mt-8 border-t border-dark-border pt-4">
                            <h3 className="text-lg mb-2">Shared Tokens (Intersection)</h3>
                            <div className="flex flex-wrap gap-2">
                                {compareResult.shared_tokens.length === 0 ? <span className="text-gray-500">None</span> :
                                    compareResult.shared_tokens.map((t, i) => (
                                        <span key={i} className="px-2 py-1 bg-dark-bg border border-dark-border rounded text-sm text-neon-yellow">{t}</span>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                )}

            </main>

            {/* Floating Compare Toggle */}
            <button
                onClick={toggleCompareMode}
                className="fixed bottom-6 right-6 p-4 rounded-full bg-dark-card border border-dark-border shadow-lg hover:border-cyan-500 transition-colors flex items-center justify-center text-cyan-500 group"
                title="Toggle Compare Mode"
            >
                <Columns className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>

        </div>
    );
}
