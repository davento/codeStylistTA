// components/FeedbackItem.tsx
'use client'

import { Loader2 } from 'lucide-react'
import { LoadingState } from './AnalyzeForm'

interface Feedback {
    error_location: string
    things_to_fix: string
    suggestions: string
    explanation: string
}

interface FeedbackItemProps {
    feedback: Feedback[]
    loading: number
}

export default function FeedbackItem({ feedback, loading }: FeedbackItemProps) {
    return (
        <div className="border p-4 rounded-md">
            {loading !== LoadingState.DONE ? (
                <div className="flex items-center gap-2">
                    <Loader2 size={20} className="animate-spin" />
                    <p>Processing...</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {feedback.map((item, idx) => (
                        <div key={idx} className="bg-gray-100 p-2 rounded-md">
                            <p>
                                <strong>Error location:</strong> {item.error_location}
                            </p>
                            <p>
                                <strong>Things to fix:</strong> {item.things_to_fix}
                            </p>
                            <p>
                                <strong>Suggestions:</strong> {item.suggestions}
                            </p>
                            <p>
                                <strong>Explanation:</strong> {item.explanation}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}