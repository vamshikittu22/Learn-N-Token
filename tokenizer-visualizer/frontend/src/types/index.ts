export type ModelSelection = 'gpt2' | 'bert-base-uncased' | 'gpt4';

export interface TokenizeRequest {
    text: string;
    model: ModelSelection;
    include_embeddings?: boolean;
    include_bpe_steps?: boolean;
}

export interface TokenInfo {
    text: string;
    display: string;
    id: number;
    type: string;
    position: number;
    frequency: number;
    color_index: number;
}

export interface BPEStep {
    step: number;
    description: string;
    tokens: string[];
    merged_pair?: [string, string];
    result_token?: string;
}

export interface EmbeddingInfo {
    token_id: number;
    token_text: string;
    vector: number[];
    full_dim: number;
}

export interface TokenizeResponse {
    tokens: TokenInfo[];
    raw_ids: number[];
    vocab_size: number;
    total_tokens: number;
    unique_tokens: number;
    reuse_rate: number;
    bpe_steps?: BPEStep[];
    embeddings?: EmbeddingInfo[];
    model_used: string;
    processing_time_ms: number;
    context_window_usage?: Record<string, number>;
}

export interface ErrorResponse {
    status_code: number;
    message: string;
    detail: string;
}

export interface AttentionRequest {
    text: string;
    model: 'bert-base-uncased';
}

export interface AttentionResponse {
    tokens: string[];
    attention_matrix: number[][];
    layer: number;
    model_used: string;
    processing_time_ms: number;
}

export interface CompareRequest {
    text1: string;
    text2: string;
    model: ModelSelection;
}

export interface CompareResponse {
    text1_tokens: string[];
    text2_tokens: string[];
    text1_ids: number[];
    text2_ids: number[];
    text1_token_count: number;
    text2_token_count: number;
    shared_tokens: string[];
    text1_efficiency_ratio: number;
    text2_efficiency_ratio: number;
    context_window_usage: Record<string, number>;
    model_used: string;
    processing_time_ms: number;
}

// UI Specific Types
export type TabType = 'tokens' | 'raw' | 'vocab' | 'embeddings' | 'attention' | 'bpe' | 'budget';

export interface SampleText {
    name: string;
    text: string;
}

export interface ModelOption {
    value: ModelSelection;
    label: string;
    vocabSize: number;
}
