import React, { useState, useEffect, useRef } from 'react';
import { useTokenizerStore } from '../store/tokenizerStore';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export default function BPEAnimation() {
    const { result } = useTokenizerStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const timerRef = useRef<number | null>(null);

    const steps = result?.bpe_steps || [];
    const maxStep = Math.max(0, steps.length - 1);

    // Auto-play interval handling
    useEffect(() => {
        if (isPlaying && steps.length > 0) {
            timerRef.current = window.setInterval(() => {
                setCurrentStep((prev) => {
                    if (prev >= maxStep) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, speed * 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, speed, maxStep, steps.length]);

    if (!result || steps.length <= 1) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
                <h3 className="text-xl text-neon-yellow mb-2">The Merging Game is Skipped!</h3>
                <p className="max-w-md">
                    {steps.length === 1
                        ? "This block was already tiny, so the robot didn't need to play the merging game. Try an unusual or very long word!"
                        : "Our current robot isn't sharing its step-by-step game history. Try switching to the GPT-2 robot!"}
                </p>
            </div>
        );
    }

    const stepData = steps[currentStep];

    return (
        <div className="w-full flex flex-col items-center gap-6">
            <div className="w-full mb-2 p-4 border border-blue-500/30 bg-blue-500/10 rounded-lg text-blue-200 text-sm leading-relaxed text-left">
                <h3 className="font-bold flex items-center gap-2 mb-1 text-blue-400">
                    <span className="text-xl">💡</span> The Merging Game
                </h3>
                <p>
                    How did the robot know exactly where to make the scissors cut for your text? It started with only the alphabet letters! Then, it played a matching game to squish the most common letters together into chunks, over and over, until it created the blocks you see above. Watch the animation to see how the letters merged!
                </p>
            </div>

            <div className="w-full flex justify-between items-center bg-dark-bg p-4 rounded-lg border border-dark-border">
                <div className="text-sm font-semibold text-gray-300">
                    Step {currentStep + 1} of {steps.length}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                        className="p-2 rounded hover:bg-dark-card disabled:opacity-50 transition-colors"
                    >
                        <SkipBack className="w-5 h-5 text-white" />
                    </button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        disabled={currentStep >= maxStep && !isPlaying}
                        className="p-3 bg-neon-purple hover:bg-neon-pink rounded-full disabled:opacity-50 transition-colors text-white"
                    >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" fill="currentColor" />}
                    </button>

                    <button
                        onClick={() => setCurrentStep(Math.min(maxStep, currentStep + 1))}
                        disabled={currentStep >= maxStep}
                        className="p-2 rounded hover:bg-dark-card disabled:opacity-50 transition-colors"
                    >
                        <SkipForward className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Speed Slider */}
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">Speed</span>
                    <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.5"
                        value={speed}
                        onChange={(e) => setSpeed(parseFloat(e.target.value))}
                        className="w-24 accent-neon-purple"
                    />
                    <span className="text-xs font-mono">{speed}s</span>
                </div>
            </div>

            {/* Scrubber */}
            <input
                type="range"
                min="0"
                max={maxStep}
                value={currentStep}
                onChange={(e) => {
                    setCurrentStep(parseInt(e.target.value));
                    setIsPlaying(false);
                }}
                className="w-full accent-neon-pink mt-2"
            />

            {/* Visualization Canvas */}
            <div className="w-full flex flex-col items-center justify-start min-h-[350px] bg-[#0a0f18] border-2 border-[#1e293b] rounded-2xl p-8 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden group">
                {/* Background Forge effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,201,106,0.05)_0%,transparent_70%)] opacity-50 transition-opacity duration-1000"></div>
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-neon-cyan/10 to-transparent"></div>

                <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#111122]/80 border border-neon-cyan/50 px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(0,255,255,0.2)] z-10">
                    <div className="w-2 h-2 rounded-full bg-neon-cyan animate-ping"></div>
                    <h3 className="text-xs font-mono text-neon-cyan tracking-widest uppercase font-bold">
                        {stepData.description}
                    </h3>
                </div>

                {/* The "Conveyor Belt" of pieces */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-16 z-10 w-full max-w-4xl relative">
                    {stepData.tokens.map((token: string, i: number) => {
                        // Check if this token is part of the highlighted merge pair
                        const isMergeTarget = stepData.merged_pair && (
                            token === stepData.merged_pair[0] || token === stepData.merged_pair[1]
                        );

                        return (
                            <div
                                key={`${i}-${token}`}
                                className={`relative flex items-center justify-center px-4 py-3 font-mono text-xl font-bold rounded-lg border-2 transition-all duration-[800ms]
                                    ${isMergeTarget
                                        ? 'border-neon-yellow bg-[#1a1a00] text-neon-yellow z-20 scale-105 shadow-[0_0_25px_rgba(245,201,106,0.6)] translate-y-2'
                                        : 'border-[#2d2d5c] bg-[#12122a] text-gray-400 shadow-[0_5px_10px_rgba(0,0,0,0.5)]'
                                    }`}
                            >
                                {/* Puzzle Snap indent/outdent visual details */}
                                <div className={`absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-4 rounded-l-full bg-black border-l-2 ${isMergeTarget ? 'border-neon-yellow' : 'border-[#2d2d5c]'}`}></div>
                                <div className={`absolute -left-1.5 top-1/2 -translate-y-1/2 w-2 h-4 rounded-r-full border-r-2 border-y-2 bg-[#12122a] ${isMergeTarget ? 'border-neon-yellow bg-[#1a1a00]' : 'border-[#2d2d5c]'}`}></div>

                                {token.replace(/ /g, '·')}
                            </div>
                        );
                    })}
                </div>

                {/* The Anvil/Forge effect for the result */}
                {stepData.result_token && (
                    <div className="mt-12 flex flex-col items-center relative z-10 w-full">
                        {/* Laser beam connecting downwards */}
                        <div className="h-10 w-[3px] bg-gradient-to-b from-neon-yellow via-neon-pink to-neon-purple shadow-[0_0_15px_rgba(245,201,106,0.8)] animate-pulse rounded-full mb-3"></div>

                        <div className="px-6 py-3 border-[3px] border-neon-pink bg-[#1a0f1a] text-white font-mono text-3xl font-black rounded-xl shadow-[0_0_40px_rgba(247,37,133,0.7)] transform animate-[bounce_1s_cubic-bezier(0,0,0.2,1)] relative overflow-hidden group/result cursor-default">
                            {/* Specular highlight */}
                            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent"></div>
                            {stepData.result_token.replace(/ /g, '·')}
                        </div>
                        <span className="text-[10px] text-neon-pink mt-3 uppercase tracking-widest font-black bg-neon-pink/10 px-3 py-1 rounded-full border border-neon-pink/30 shadow-[0_0_10px_rgba(247,37,133,0.3)]">
                            Successfully Forged Subword
                        </span>
                    </div>
                )}
            </div>

            <div className="w-full bg-[#12122a] p-4 rounded-lg border border-[#1e1e3a] text-sm text-gray-300 mt-4">
                <div className="mb-4 bg-neon-purple/10 border border-neon-purple/30 p-3 rounded text-neon-purple/90 font-mono text-xs leading-relaxed">
                    <span className="font-bold text-neon-purple">Note on the Ġ symbol:</span> Why is there a weird <code>Ġ</code> letter everywhere? The robot's scissors get confused by empty spaces! So, to remember where the spaces were, it trades every Space bar click for a <code>Ġ</code> instead. Meaning `ĠRobot` is basically ` Robot`!
                </div>
            </div>
        </div>
    );
}
