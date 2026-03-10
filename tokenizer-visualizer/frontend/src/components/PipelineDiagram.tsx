import React, { useState } from 'react';
import { Scissors, Library, BrainCircuit, Activity, ChevronRight, Hash } from 'lucide-react';
import { TokenInfo } from '../types';

interface PipelineDiagramProps {
    input?: string;
    tokens?: TokenInfo[];
    rawIds?: number[];
}

export default function PipelineDiagram({ input, tokens, rawIds }: PipelineDiagramProps) {
    const [hoverStep, setHoverStep] = useState<number | null>(null);
    const hasData = input && tokens && rawIds && tokens.length > 0;

    const getHslColor = (id: number) => `hsl(${(id * 137.5) % 360}, 80%, 65%)`;

    // 1. Raw Text Example
    const rawTextExample = (
        <div className="p-3 bg-dark-bg rounded border border-dark-border font-mono text-xs sm:text-sm text-gray-300 truncate" title={hasData ? input : "I love robots!"}>
            "{hasData ? (input.length > 30 ? input.substring(0, 30) + '...' : input) : "I love robots!"}"
        </div>
    );

    // 2. Magic Scissors Example
    const tokensExample = (
        <div className="flex flex-wrap gap-1 text-xs sm:text-sm font-mono mt-2">
            {!hasData ? (
                <>
                    <span className="px-2 py-1 bg-neon-pink/20 border border-neon-pink text-neon-pink rounded shadow-[0_0_10px_rgba(245,106,154,0.3)]">"I"</span>
                    <span className="px-2 py-1 bg-neon-pink/20 border border-neon-pink text-neon-pink rounded shadow-[0_0_10px_rgba(245,106,154,0.3)]">"love"</span>
                    <span className="px-2 py-1 bg-neon-purple/20 border border-neon-purple text-neon-purple rounded shadow-[0_0_10px_rgba(124,106,245,0.3)]">"robot"</span>
                    <span className="px-2 py-1 bg-neon-cyan/20 border border-neon-cyan text-neon-cyan rounded shadow-[0_0_10px_rgba(13,204,242,0.3)]">"s!"</span>
                </>
            ) : (
                <>
                    {tokens.slice(0, 4).map((t, i) => {
                        const color = getHslColor(t.id);
                        return (
                            <span
                                key={i}
                                className="px-2 py-1 rounded border opacity-90 truncate max-w-[80px]"
                                style={{ backgroundColor: `${color}33`, borderColor: color, color: color, boxShadow: `0 0 10px ${color}4d` }}
                            >
                                "{t.display.replace(/ /g, '·')}"
                            </span>
                        );
                    })}
                    {tokens.length > 4 && <span className="px-2 py-1 text-gray-500">...</span>}
                </>
            )}
        </div>
    );

    // 3. The Library Example
    const libraryExample = (
        <div className="flex flex-col gap-1 text-xs font-mono mt-2 bg-dark-bg p-2 rounded border border-dark-border overflow-hidden">
            <div className="flex justify-between text-gray-400"><span>Dictionary</span><span>ID</span></div>
            {!hasData ? (
                <>
                    <div className="flex justify-between border-t border-dark-border pt-1"><span>"robot"</span><span className="text-neon-yellow font-bold">42</span></div>
                    <div className="flex justify-between"><span>"s!"</span><span className="text-neon-yellow font-bold">19</span></div>
                </>
            ) : (
                <>
                    {tokens.slice(0, 3).map((t, i) => (
                        <div key={i} className={`flex justify-between ${i === 0 ? 'border-t border-dark-border pt-1' : ''}`}>
                            <span className="truncate max-w-[80px]">"{t.display.replace(/ /g, '·')}"</span>
                            <span className="text-neon-yellow font-bold">{t.id}</span>
                        </div>
                    ))}
                    {tokens.length > 3 && <div className="text-center text-gray-600 leading-none">...</div>}
                </>
            )}
        </div>
    );

    // 4. Robot Code Example
    const rawIdsExample = (
        <div className="p-3 bg-neon-purple/20 rounded border border-neon-purple font-mono font-bold tracking-widest text-[#d5ccff] shadow-[0_0_15px_rgba(124,106,245,0.4)] truncate text-xs sm:text-sm">
            [ {!hasData ? " 4, 902, 42, 19 " : rawIds.slice(0, 4).join(', ') + (rawIds.length > 4 ? ', ...' : '')} ]
        </div>
    );

    const steps = [
        {
            id: 1,
            title: "1. The Raw Text",
            icon: <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-neon-cyan" />,
            color: "border-neon-cyan",
            bgColor: "bg-neon-cyan/10",
            textColor: "text-neon-cyan",
            content: "You type a sentence.",
            example: rawTextExample,
            tooltip: "This is just a normal human sentence. But computers only understand math!"
        },
        {
            id: 2,
            title: "2. Magic Scissors",
            icon: <Scissors className="w-5 h-5 sm:w-6 sm:h-6 text-neon-pink" />,
            color: "border-neon-pink",
            bgColor: "bg-neon-pink/10",
            textColor: "text-neon-pink",
            content: "We chop it into blocks.",
            example: tokensExample,
            tooltip: "A Tokenizer acts like magic scissors. Instead of cutting by word, it cuts by familiar 'root' patterns to save space. We call these pieces 'Tokens'!"
        },
        {
            id: 3,
            title: "3. Giant Library",
            icon: <Library className="w-5 h-5 sm:w-6 sm:h-6 text-neon-yellow" />,
            color: "border-neon-yellow",
            bgColor: "bg-neon-yellow/10",
            textColor: "text-neon-yellow",
            content: "Find the secret ID.",
            example: libraryExample,
            tooltip: "The AI has a giant dictionary book with 50,000 words. It looks up every cut block and finds its unique secret number."
        },
        {
            id: 4,
            title: "4. Robot Code",
            icon: <Hash className="w-5 h-5 sm:w-6 sm:h-6 text-neon-purple" />,
            color: "border-neon-purple",
            bgColor: "bg-neon-purple/10",
            textColor: "text-neon-purple",
            content: "Ready for the Brain!",
            example: rawIdsExample,
            tooltip: "Ta-da! The sentence is completely gone. Now it's just a row of secret numbers. The AI brain can feed on this perfectly!"
        }
    ];

    return (
        <div className={`w-full bg-[#0a0a14] border border-[#1e1e3a] p-4 sm:p-8 rounded-2xl relative overflow-hidden ${hasData ? 'mb-8 mt-2' : 'my-8'}`}>
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <BrainCircuit className="w-64 h-64" />
            </div>

            <div className="text-center mb-10 relative z-10">
                <h3 className={`font-bold text-white mb-2 ${hasData ? 'text-2xl' : 'text-3xl'}`}>The Tokenization Factory</h3>
                <p className={`text-gray-400 ${hasData ? 'text-sm' : 'text-lg'}`}>Hover over any step below to see exactly how {hasData ? "your text became" : "text becomes"} numbers, explained for a 5-year-old!</p>
            </div>

            <div className="flex flex-col lg:flex-row items-stretch justify-between gap-4 relative z-10">
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        {/* Step Card */}
                        <div
                            className={`flex flex-col p-4 sm:p-5 bg-[#12122a] border ${hoverStep === step.id ? 'border-gray-300 transform scale-105' : 'border-[#1e1e3a]'} rounded-xl w-full lg:w-1/4 transition-all duration-300 cursor-crosshair relative overflow-visible group min-h-[220px]`}
                            onMouseEnter={() => setHoverStep(step.id)}
                            onMouseLeave={() => setHoverStep(null)}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${step.bgColor}`}>
                                    {step.icon}
                                </div>
                                <h4 className="font-bold text-white text-[13px] sm:text-[15px]">{step.title}</h4>
                            </div>

                            <p className="text-xs sm:text-sm text-gray-400 mb-4">{step.content}</p>

                            <div className="mt-auto">
                                {step.example}
                            </div>

                            {/* Hover Tooltip/Popup */}
                            <div className={`absolute -top-20 left-1/2 transform -translate-x-1/2 w-64 p-3 bg-white text-black text-xs sm:text-sm font-semibold rounded shadow-2xl transition-opacity duration-300 z-50 pointer-events-none ${hoverStep === step.id ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
                                {step.tooltip}
                            </div>
                        </div>

                        {/* Connector Arrow */}
                        {index < steps.length - 1 && (
                            <div className="hidden lg:flex items-center justify-center text-gray-600">
                                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                            </div>
                        )}
                        {index < steps.length - 1 && (
                            <div className="flex lg:hidden items-center justify-center text-gray-600 my-1">
                                <ChevronRight className="w-8 h-8 rotate-90" />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
