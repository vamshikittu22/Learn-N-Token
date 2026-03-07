import { create } from 'zustand'
import { tokenizeText } from '@/api/tokenizer'
import type { TokenizeResponse, TabType } from '@/types'

interface TokenizerState {
    // Input state
    input: string
    model: 'gpt2' | 'bert-base-uncased'

    // Response state
    result: TokenizeResponse | null
    loading: boolean
    error: string | null

    // UI state
    selectedTokenId: number | null
    activeTab: TabType

    // Actions
    setInput: (value: string) => void
    setModel: (model: 'gpt2' | 'bert-base-uncased') => void
    setActiveTab: (tab: TabType) => void
    selectToken: (id: number | null) => void
    tokenize: () => Promise<void>
    reset: () => void
}

export const useTokenizerStore = create<TokenizerState>((set, get) => ({
    // Initial state
    input: '',
    model: 'gpt2',
    result: null,
    loading: false,
    error: null,
    selectedTokenId: null,
    activeTab: 'tokens',

    // Actions
    setInput: (value) => set({ input: value, error: null }),

    setModel: (model) => set({ model }),

    setActiveTab: (tab) => set({ activeTab: tab }),

    selectToken: (id) => set({ selectedTokenId: id }),

    tokenize: async () => {
        const { input, model } = get()

        if (!input.trim()) {
            set({ error: 'Please enter some text to tokenize' })
            return
        }

        if (input.length > 2000) {
            set({ error: 'Text is too long. Maximum 2000 characters allowed.' })
            return
        }

        set({ loading: true, error: null })

        try {
            const result = await tokenizeText({
                text: input,
                model,
                include_embeddings: true,
                include_bpe_steps: true,
            })

            set({ result, loading: false, selectedTokenId: null })
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to tokenize text'
            set({ error: errorMessage, loading: false })
        }
    },

    reset: () => set({
        input: '',
        result: null,
        error: null,
        selectedTokenId: null,
        activeTab: 'tokens',
    }),
}))
