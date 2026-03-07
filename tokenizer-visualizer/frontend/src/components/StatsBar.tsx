import { Activity, Hash, Layers, Percent, Clock } from 'lucide-react'
import type { TokenizeResponse } from '@/types'

interface StatsBarProps {
    result: TokenizeResponse
}

export default function StatsBar({ result }: StatsBarProps) {
    const stats = [
        {
            icon: Hash,
            label: 'Total Tokens',
            value: result.total_tokens.toLocaleString(),
            color: 'text-[#7c6af5]',
        },
        {
            icon: Layers,
            label: 'Unique Tokens',
            value: result.unique_tokens.toLocaleString(),
            color: 'text-[#f56a9a]',
        },
        {
            icon: Percent,
            label: 'Reuse Rate',
            value: `${(result.reuse_rate * 100).toFixed(1)}%`,
            color: 'text-[#6af5a0]',
        },
        {
            icon: Activity,
            label: 'Vocab Size',
            value: result.vocab_size.toLocaleString(),
            color: 'text-[#f5c96a]',
        },
        {
            icon: Clock,
            label: 'Processing Time',
            value: `${result.processing_time_ms.toFixed(1)}ms`,
            color: 'text-[#6ac8f5]',
        },
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.map((stat) => {
                const Icon = stat.icon
                return (
                    <div key={stat.label} className="card border-[#1E293B] bg-[#0F172A] p-5 flex flex-col justify-center items-center text-center">
                        <div className="text-3xl font-extrabold mb-1 tracking-tight" style={{ color: stat.color.replace('text-[', '').replace(']', '') }}>
                            {stat.value}
                        </div>
                        <div className="text-[0.65rem] uppercase tracking-[1.5px] text-[#555] font-semibold flex items-center justify-center gap-1.5 mt-1">
                            {stat.label}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
