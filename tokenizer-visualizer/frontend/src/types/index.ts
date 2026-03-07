// Mirror all Pydantic models exactly

export interface TokenizeRequest {
    text: string
    model: 'gpt2' | 'bert-base-uncased'
    include_embeddings?: boolean
    include_bpe_steps?: boolean
}

export interface TokenInfo {
    text: string
    display: string
    id: number
    type: 'word' | 'subword' | 'punctuation' | 'special'
    position: number
    frequency: number
    color_index: number
}

export interface BPEStep {
    step: number
    description: string
    tokens: string[]
    merged_pair?: [string, string] | null
    result_token?: string | null
}

export interface EmbeddingInfo {
    token_id: number
    token_text: string
    vector: number[]
    full_dim: number
}

export interface TokenizeResponse {
    tokens: TokenInfo[]
    raw_ids: number[]
    vocab_size: number
    total_tokens: number
    unique_tokens: number
    reuse_rate: number
    bpe_steps?: BPEStep[] | null
    embeddings?: EmbeddingInfo[] | null
    model_used: string
    processing_time_ms: number
}

// UI-specific types
export type TabType = 'bpe' | 'tokens' | 'embeddings' | 'attention' | 'vocab' | 'raw'

export interface SampleText {
    name: string
    text: string
}

export const SAMPLE_TEXTS: SampleText[] = [
    {
        name: 'Story',
        text: 'The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet.',
    },
    {
        name: 'Code',
        text: 'function tokenize(text) { return text.split(" ").map(word => word.toLowerCase()); }',
    },
    {
        name: 'RAG Document',
        text: 'Large Language Models use tokenization to convert text into numerical representations. The most common algorithm is Byte Pair Encoding (BPE), which iteratively merges the most frequent character pairs.',
    },
]
