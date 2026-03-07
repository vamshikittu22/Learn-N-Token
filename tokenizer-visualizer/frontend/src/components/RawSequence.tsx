import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import type { TokenizeResponse } from '@/types'

interface RawSequenceProps {
    result: TokenizeResponse
}

export default function RawSequence({ result }: RawSequenceProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        const text = JSON.stringify(result.raw_ids, null, 2)
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="card border-[#1E293B] bg-[#0F172A]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-[#7c6af5] uppercase tracking-widest">Raw Token IDs</h3>
                <button
                    onClick={handleCopy}
                    className="btn-secondary flex items-center gap-2 text-xs py-1.5 px-3"
                    title="Copy to clipboard"
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4 text-[#22C55E]" />
                            <span className="text-[#22C55E]">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            Copy
                        </>
                    )}
                </button>
            </div>

            <div className="bg-[#080812] border border-[#2a2a4a] rounded-lg p-6 overflow-x-auto shadow-inner">
                <div className="text-[#555] text-xs mb-3 font-mono">
                    // {result.raw_ids.length} token IDs — this is ALL the transformer sees
                </div>
                <pre className="text-sm font-mono text-[#7c6af5] break-all whitespace-pre-wrap leading-relaxed">
                    [{result.raw_ids.join(', ')}]
                </pre>
            </div>

            <div className="info-box mt-6">
                <p>
                    These are the actual token IDs that the model uses internally. Each ID corresponds to a specific token in the vocabulary.
                </p>
                <p className="mt-2 text-[#666]">
                    Model used: <strong className="text-[#f5c96a] font-mono ml-1">{result.model_used}</strong>
                </p>
            </div>
        </div>
    )
}
