import { useTokenizerStore } from '@/store/tokenizerStore'
import type { TokenInfo } from '@/types'


export default function TokenDisplay() {
    const { result, selectedTokenId, selectToken } = useTokenizerStore()

    if (!result) {
        return (
            <div className="card text-center text-[#94a3b8]">
                <p>Enter text and click "Tokenize" to see the token visualization</p>
            </div>
        )
    }

    return (
        <div className="card border-[#1E293B] bg-[#0F172A]">
            <h3 className="text-sm font-bold text-[#7c6af5] uppercase tracking-widest mb-6">Token Visualization</h3>

            <div className="flex flex-wrap gap-2 mb-8 font-mono">
                {result.tokens.map((token, idx) => {
                    // Match token typings to the tailwind token colors
                    const typeColors: Record<string, string> = {
                        word: '#7c6af5',
                        subword: '#f5c96a',
                        punctuation: '#f56a7c',
                        special: '#6ac8f5',
                        number: '#6af5a0'
                    };
                    const tc = typeColors[token.type] || '#888';
                    const isSelected = selectedTokenId === token.id;

                    return (
                        <span
                            key={`${token.id}-${idx}`}
                            onClick={() => selectToken(isSelected ? null : token.id)}
                            className={`
                                inline-flex flex-col items-center px-2.5 py-1 rounded-[6px] border border-transparent cursor-pointer 
                                transition-all duration-150 hover:-translate-y-0.5 min-w-[28px]
                                ${isSelected ? 'ring-2 ring-white scale-105 z-10' : ''}
                            `}
                            style={{
                                backgroundColor: `${tc}20`,
                                borderColor: `${tc}60`,
                                color: tc,
                                boxShadow: isSelected ? `0 0 12px ${tc}80` : 'none'
                            }}
                            title={`Token: "${token.display}" | ID: ${token.id} | Type: ${token.type} | Freq: ${token.frequency}x`}
                        >
                            <span className="text-[0.88rem] font-semibold whitespace-pre">
                                {token.display.replace(/ /g, '·')}
                            </span>
                            <span className="text-[0.58rem] opacity-70 mt-0.5">
                                {token.id}
                            </span>
                        </span>
                    )
                })}
            </div>

            <div className="border-t border-[#1E293B] pt-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="bg-[#12122a] p-3 rounded-lg border border-[#1e1e3a]">
                        <span className="text-[#94a3b8] block text-[0.7rem] uppercase tracking-wider mb-1">Total Tokens</span>
                        <span className="font-bold text-[#e0e0e0] text-lg">{result.total_tokens}</span>
                    </div>
                    <div className="bg-[#12122a] p-3 rounded-lg border border-[#1e1e3a]">
                        <span className="text-[#94a3b8] block text-[0.7rem] uppercase tracking-wider mb-1">Unique</span>
                        <span className="font-bold text-[#e0e0e0] text-lg">{result.unique_tokens}</span>
                    </div>
                    <div className="bg-[#12122a] p-3 rounded-lg border border-[#1e1e3a]">
                        <span className="text-[#94a3b8] block text-[0.7rem] uppercase tracking-wider mb-1">Reuse Rate</span>
                        <span className="font-bold text-[#e0e0e0] text-lg">{(result.reuse_rate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="bg-[#12122a] p-3 rounded-lg border border-[#1e1e3a]">
                        <span className="text-[#94a3b8] block text-[0.7rem] uppercase tracking-wider mb-1">Selected ID</span>
                        <span className="font-bold text-[#7c6af5] text-lg">
                            {selectedTokenId !== null ? `#${selectedTokenId}` : 'None'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="info-box mt-6">
                <strong>💡 Tips:</strong>
                <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Click any token to highlight all instances of that token ID</li>
                    <li>Hover over tokens to see detailed information</li>
                    <li>Colors are consistent for the same token type across the text</li>
                </ul>
            </div>
        </div>
    )
}
