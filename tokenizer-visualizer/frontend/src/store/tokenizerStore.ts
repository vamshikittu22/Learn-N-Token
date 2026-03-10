import { create } from 'zustand';
import { TokenizeResponse, ModelSelection, TabType, CompareResponse } from '../types';
import { tokenizeText, compareTexts } from '../api/tokenizer';

interface TokenizerState {
    input: string;
    model: ModelSelection;
    result: TokenizeResponse | null;
    loading: boolean;
    error: string | null;
    selectedTokenId: number | null;
    activeTab: TabType;
    compareMode: boolean;
    compareInput: string;
    compareResult: CompareResponse | null;

    setInput: (text: string) => void;
    setModel: (model: ModelSelection) => void;
    setActiveTab: (tab: TabType) => void;
    selectToken: (id: number | null) => void;
    tokenize: () => Promise<void>;
    reset: () => void;
    toggleCompareMode: () => void;
    setCompareInput: (text: string) => void;
    runComparison: () => Promise<void>;
}

export const useTokenizerStore = create<TokenizerState>((set, get) => ({
    input: '',
    model: 'gpt2',
    result: null,
    loading: false,
    error: null,
    selectedTokenId: null,
    activeTab: 'tokens',
    compareMode: false,
    compareInput: '',
    compareResult: null,

    setInput: (text) => set({ input: text }),
    setModel: (model) => set({ model }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    selectToken: (id) => set((state) => ({
        selectedTokenId: state.selectedTokenId === id ? null : id
    })),

    tokenize: async () => {
        const { input, model } = get();
        if (!input.trim()) return;

        set({ loading: true, error: null, result: null, selectedTokenId: null });
        try {
            const res = await tokenizeText({
                text: input,
                model,
                include_bpe_steps: true,
                include_embeddings: true
            });
            set({ result: res, loading: false });
        } catch (err: any) {
            set({ error: err.message || 'Failed to tokenize text', loading: false });
        }
    },

    reset: () => set({
        input: '', result: null, error: null,
        selectedTokenId: null, compareInput: '', compareResult: null
    }),

    toggleCompareMode: () => set((state) => ({ compareMode: !state.compareMode })),

    setCompareInput: (text) => set({ compareInput: text }),

    runComparison: async () => {
        const { input, compareInput, model } = get();
        if (!input.trim() || !compareInput.trim()) return;

        set({ loading: true, error: null, compareResult: null });
        try {
            const res = await compareTexts(input, compareInput, model);
            set({ compareResult: res, loading: false });
        } catch (err: any) {
            set({ error: err.message || 'Failed to compare texts', loading: false });
        }
    }
}));
