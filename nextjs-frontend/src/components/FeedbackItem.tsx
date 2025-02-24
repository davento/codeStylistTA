'use client'

import { useState, useEffect } from 'react'
import { Loader2, Star, Info } from 'lucide-react'
import { LoadingState } from './AnalyzeForm'
import { useUser } from '@/context/UserContext'

interface SingleFeedback {
    error_location: string
    things_to_fix: string
    suggestions: string
    explanation: string
}

interface FeedbackItemProps {
    fileName: string
    feedback: SingleFeedback[] // Array of feedback objects
    loading: number // The loading state (LoadingState enum)
}

export default function FeedbackItem({ fileName, feedback, loading }: FeedbackItemProps) {
    const { username } = useUser()
    const [ratings, setRatings] = useState<number[]>(() => feedback.map(() => 0))
    const [submitted, setSubmitted] = useState<boolean[]>(() => feedback.map(() => false))
    const [showInfo, setShowInfo] = useState(false)

    // Reset states when feedback changes (e.g. when switching files)
    useEffect(() => {
        setRatings(feedback.map(() => 0))
        setSubmitted(feedback.map(() => false))
    }, [feedback])

    const handleRatingChange = (itemIndex: number, ratingValue: number) => {
        const newRatings = [...ratings]
        newRatings[itemIndex] = newRatings[itemIndex] === ratingValue ? 0 : ratingValue
        setRatings(newRatings)
        const newSubmitted = [...submitted]
        newSubmitted[itemIndex] = false
        setSubmitted(newSubmitted)
    }

    const handleSubmitRating = async (itemIndex: number) => {
        const payload = {
            username, // Pass the logged in username
            fileName,
            feedback: {
                error_location: feedback[itemIndex].error_location,
                things_to_fix: feedback[itemIndex].things_to_fix,
                suggestions: feedback[itemIndex].suggestions,
                explanation: feedback[itemIndex].explanation,
            },
            rating: ratings[itemIndex],
        }

        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_API_URL + '/submit_rating',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }
            )

            if (response.ok) {
                console.log(
                    `Submitted rating for feedback #${itemIndex} in file ${fileName}: ${ratings[itemIndex]}`
                )
                const newSubmitted = [...submitted]
                newSubmitted[itemIndex] = true
                setSubmitted(newSubmitted)
            } else {
                console.error('Failed to submit rating:', await response.text())
            }
        } catch (error) {
            console.error('Error submitting rating:', error)
        }
    }

    return (
        <div className="border p-4 rounded-md">
            {loading !== LoadingState.DONE ? (
                <div className="flex items-center gap-2">
                    <Loader2 size={20} className="animate-spin" />
                    <p>Processing...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {feedback.map((item, idx) => (
                        <div key={idx} className="bg-gray-100 p-4 rounded-md">
                            <p className="mb-1">
                                <strong>Error location:</strong> {item.error_location}
                            </p>
                            <p className="mb-1">
                                <strong>Things to fix:</strong> {item.things_to_fix}
                            </p>
                            <p className="mb-1">
                                <strong>Suggestions:</strong> {item.suggestions}
                            </p>
                            <p className="mb-2">
                                <strong>Explanation:</strong> {item.explanation}
                            </p>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((starValue) => (
                                    <Star
                                        key={starValue}
                                        className={`w-5 h-5 cursor-pointer ${
                                            starValue <= ratings[idx]
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                        }`}
                                        onClick={() => handleRatingChange(idx, starValue)}
                                    />
                                ))}
                                <span className="ml-2 text-sm text-gray-600">
                  {ratings[idx] > 0 ? `${ratings[idx]}/5` : 'No rating'}
                </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                <p>Your rating helps improve our model.</p>
                                <Info
                                    className="w-4 h-4 cursor-pointer text-blue-500"
                                    onClick={() => setShowInfo(true)}
                                />
                            </div>
                            {ratings[idx] > 0 && !submitted[idx] && (
                                <button
                                    onClick={() => handleSubmitRating(idx)}
                                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                >
                                    Submit Rating
                                </button>
                            )}
                            {submitted[idx] && (
                                <p className="mt-2 text-green-600 text-sm">Rating submitted!</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {showInfo && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Feedback Information</h2>
                        <p className="text-gray-700 mb-4">
                            Your ratings help us continuously improve our model by providing insight into the quality of our feedback.
                        </p>
                        <button
                            onClick={() => setShowInfo(false)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}