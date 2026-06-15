'use client'

import { useState, useEffect } from 'react'
import { Loader2, Star, Info, ThumbsUp, ThumbsDown, Minus, ChevronDown, ChevronRight } from 'lucide-react'
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
    tabIndex: number // Add tabIndex to ensure unique identification
}

// Resolution status options
type ResolutionStatus = 'yes' | 'no' | 'neutral';

// Create a type for persisted ratings and resolutions
interface SavedFeedbackData {
    [key: string]: { // fileName as key
        [feedbackItemId: string]: { // Combined identifier as key
            rating: number
            submitted: boolean
            resolution: ResolutionStatus
            expanded: boolean // Track expanded state
        }
    }
}

export default function FeedbackItem({ fileName, feedback, loading, tabIndex }: FeedbackItemProps) {
    const { username } = useUser()
    const [ratings, setRatings] = useState<number[]>([])
    const [resolutions, setResolutions] = useState<ResolutionStatus[]>([])
    const [submitted, setSubmitted] = useState<boolean[]>([])
    const [expanded, setExpanded] = useState<boolean[]>([]) // Track which items are expanded
    const [showInfo, setShowInfo] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)

    // Generate a unique key for each feedback item to store in localStorage
    const getSavedDataKey = () => `feedback_data_${username || 'anonymous'}`

    // Generate unique id for a feedback item
    const getFeedbackItemId = (idx: number) => {
        return `${fileName}|${idx}|${tabIndex}|${feedback[idx]?.error_location?.substring(0, 20) || ''}`
    }

    // Initialize state arrays with the right size
    useEffect(() => {
        if (feedback.length > 0) {
            setRatings(Array(feedback.length).fill(0))
            setResolutions(Array(feedback.length).fill('neutral'))
            setSubmitted(Array(feedback.length).fill(false))
            setExpanded(Array(feedback.length).fill(false)) // All collapsed by default
        }
    }, [feedback])

    // Load persisted data from localStorage when component mounts or feedback changes
    useEffect(() => {
        if (feedback.length === 0) return

        try {
            // Create properly sized arrays regardless of what's in storage
            const newRatings = Array(feedback.length).fill(0)
            const newResolutions = Array(feedback.length).fill('neutral' as ResolutionStatus)
            const newSubmitted = Array(feedback.length).fill(false)
            const newExpanded = Array(feedback.length).fill(false) // All collapsed by default

            const savedDataStr = localStorage.getItem(getSavedDataKey())
            if (savedDataStr) {
                const savedData: SavedFeedbackData = JSON.parse(savedDataStr)

                if (savedData[fileName]) {
                    // For each feedback item in this file
                    feedback.forEach((item, idx) => {
                        const itemId = getFeedbackItemId(idx)

                        // If we have saved data for this specific item
                        if (savedData[fileName][itemId]) {
                            newRatings[idx] = savedData[fileName][itemId].rating
                            newResolutions[idx] = savedData[fileName][itemId].resolution
                            newSubmitted[idx] = savedData[fileName][itemId].submitted
                            // If expanded state exists in saved data, use it, otherwise default to false
                            newExpanded[idx] = savedData[fileName][itemId].expanded || false
                        }
                    })
                }
            }

            // Set the state with proper data
            setRatings(newRatings)
            setResolutions(newResolutions)
            setSubmitted(newSubmitted)
            setExpanded(newExpanded)
            setIsInitialized(true)

        } catch (error) {
            console.error('Error loading saved feedback data:', error)
            // Initialize with default values
            setRatings(Array(feedback.length).fill(0))
            setResolutions(Array(feedback.length).fill('neutral'))
            setSubmitted(Array(feedback.length).fill(false))
            setExpanded(Array(feedback.length).fill(false))
            setIsInitialized(true)
        }
    }, [feedback, fileName, username, tabIndex])

    // Save data to localStorage
    const saveDataToLocalStorage = (
        idx: number,
        newRating?: number,
        newResolution?: ResolutionStatus,
        newSubmitted?: boolean,
        newExpanded?: boolean
    ) => {
        try {
            const savedDataStr = localStorage.getItem(getSavedDataKey())
            const savedData: SavedFeedbackData = savedDataStr ? JSON.parse(savedDataStr) : {}

            // Initialize this file's data if not present
            if (!savedData[fileName]) {
                savedData[fileName] = {}
            }

            // Get the unique id for this feedback item
            const itemId = getFeedbackItemId(idx)

            // Initialize item data if not present
            if (!savedData[fileName][itemId]) {
                savedData[fileName][itemId] = {
                    rating: 0,
                    resolution: 'neutral',
                    submitted: false,
                    expanded: false
                }
            }

            // Update the values that were changed
            if (newRating !== undefined) {
                savedData[fileName][itemId].rating = newRating
            }

            if (newResolution !== undefined) {
                savedData[fileName][itemId].resolution = newResolution
            }

            if (newSubmitted !== undefined) {
                savedData[fileName][itemId].submitted = newSubmitted
            }

            if (newExpanded !== undefined) {
                savedData[fileName][itemId].expanded = newExpanded
            }

            localStorage.setItem(getSavedDataKey(), JSON.stringify(savedData))
        } catch (error) {
            console.error('Error saving feedback data:', error)
        }
    }

    const handleRatingChange = (itemIndex: number, ratingValue: number) => {
        if (!isInitialized) return

        setRatings(prev => {
            const newRatings = [...prev]
            newRatings[itemIndex] = newRatings[itemIndex] === ratingValue ? 0 : ratingValue
            return newRatings
        })

        setSubmitted(prev => {
            const newSubmitted = [...prev]
            newSubmitted[itemIndex] = false
            return newSubmitted
        })

        // Update this specific item's rating
        const newRating = ratings[itemIndex] === ratingValue ? 0 : ratingValue
        saveDataToLocalStorage(itemIndex, newRating, undefined, false)
    }

    const handleResolutionChange = (itemIndex: number, status: ResolutionStatus) => {
        if (!isInitialized) return

        setResolutions(prev => {
            const newResolutions = [...prev]
            newResolutions[itemIndex] = status
            return newResolutions
        })

        setSubmitted(prev => {
            const newSubmitted = [...prev]
            newSubmitted[itemIndex] = false
            return newSubmitted
        })

        // Update this specific item's resolution
        saveDataToLocalStorage(itemIndex, undefined, status, false)
    }

    const toggleExpanded = (itemIndex: number) => {
        if (!isInitialized) return

        setExpanded(prev => {
            const newExpanded = [...prev]
            newExpanded[itemIndex] = !newExpanded[itemIndex]
            return newExpanded
        })

        // Save the expanded state
        saveDataToLocalStorage(itemIndex, undefined, undefined, undefined, !expanded[itemIndex])
    }

    const handleSubmitRating = async (itemIndex: number) => {
        if (!isInitialized) return

        const payload = {
            username: username || 'anonymous',
            fileName,
            feedback: {
                error_location: feedback[itemIndex].error_location,
                things_to_fix: feedback[itemIndex].things_to_fix,
                suggestions: feedback[itemIndex].suggestions,
                explanation: feedback[itemIndex].explanation,
            },
            rating: ratings[itemIndex],
            resolution: resolutions[itemIndex]
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
                    `Submitted rating for feedback #${itemIndex} in file ${fileName}: ${ratings[itemIndex]}, Resolution: ${resolutions[itemIndex]}`
                )

                setSubmitted(prev => {
                    const newSubmitted = [...prev]
                    newSubmitted[itemIndex] = true
                    return newSubmitted
                })

                saveDataToLocalStorage(itemIndex, undefined, undefined, true)
            } else {
                console.error('Failed to submit rating:', await response.text())
            }
        } catch (error) {
            console.error('Error submitting rating:', error)
        }
    }

    // Helper function to get resolution button styling
    const getResolutionButtonClass = (status: ResolutionStatus, currentStatus: ResolutionStatus) => {
        const baseClass = "p-2 rounded-md flex items-center justify-center";

        if (status === currentStatus) {
            switch (status) {
                case 'yes':
                    return `${baseClass} bg-green-100 text-green-600 border border-green-300`;
                case 'no':
                    return `${baseClass} bg-red-100 text-red-600 border border-red-300`;
                case 'neutral':
                    return `${baseClass} bg-gray-100 text-gray-600 border border-gray-300`;
            }
        }

        return `${baseClass} bg-white text-gray-400 border border-gray-200 hover:bg-gray-50`;
    };

    // If not initialized yet and there's feedback, show a loading state
    if (!isInitialized && feedback.length > 0) {
        return (
            <div className="border p-4 rounded-md">
                <div className="flex items-center gap-2">
                    <Loader2 size={20} className="animate-spin" />
                    <p>Loading feedback data...</p>
                </div>
            </div>
        );
    }

    // If processing is done and no feedback was returned, show a specific error message.
    if (loading === LoadingState.DONE && feedback.length === 0) {
        return (
            <div className="border p-4 rounded-md">
                <p className="text-slate-950 font-bold">No feedback returned for this file.</p>
            </div>
        );
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
                        <div key={`${fileName}-${tabIndex}-${idx}-${item.error_location?.substring(0, 10)}`}
                             className="bg-gray-100 p-4 rounded-md">
                            {/* Collapsible header */}
                            <div
                                className="flex items-center cursor-pointer"
                                onClick={() => toggleExpanded(idx)}
                            >
                                {expanded[idx] ? (
                                    <ChevronDown size={20} className="text-gray-600 mr-2" />
                                ) : (
                                    <ChevronRight size={20} className="text-gray-600 mr-2" />
                                )}
                                <div className="font-medium text-gray-800">
                                    {item.error_location}
                                </div>
                            </div>

                            {/* Collapsible content */}
                            {expanded[idx] && (
                                <div className="mt-3 ml-6 space-y-2">
                                    <p className="mb-1">
                                        <strong>Things to fix:</strong> {item.things_to_fix}
                                    </p>
                                    <p className="mb-1">
                                        <strong>Suggestions:</strong> {item.suggestions}
                                    </p>
                                    <p className="mb-2">
                                        <strong>Explanation:</strong> {item.explanation}
                                    </p>

                                    {/* Rating Stars */}
                                    <div className="flex items-center gap-1 mb-3">
                                        <span className="text-sm text-gray-600 mr-2">Rate this feedback:</span>
                                        {[1, 2, 3, 4, 5].map((starValue) => (
                                            <Star
                                                key={`${fileName}-star-${idx}-${tabIndex}-${starValue}`}
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

                                    {/* Issue Resolution Buttons */}
                                    <div className="mb-3">
                                        <p className="text-sm text-gray-600 mb-2">Issue resolved?</p>
                                        <div className="flex gap-2">
                                            <button
                                                className={getResolutionButtonClass('yes', resolutions[idx])}
                                                onClick={() => handleResolutionChange(idx, 'yes')}
                                                title="Yes, issue resolved"
                                            >
                                                <ThumbsUp size={16} className="mr-1" /> Yes
                                            </button>
                                            <button
                                                className={getResolutionButtonClass('no', resolutions[idx])}
                                                onClick={() => handleResolutionChange(idx, 'no')}
                                                title="No, issue not resolved"
                                            >
                                                <ThumbsDown size={16} className="mr-1" /> No
                                            </button>
                                            <button
                                                className={getResolutionButtonClass('neutral', resolutions[idx])}
                                                onClick={() => handleResolutionChange(idx, 'neutral')}
                                                title="Not applicable"
                                            >
                                                <Minus size={16} className="mr-1" /> N/A
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <p>Your feedback helps improve our model.</p>
                                        <Info
                                            className="w-4 h-4 cursor-pointer text-blue-500"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowInfo(true);
                                            }}
                                        />
                                    </div>

                                    {ratings[idx] > 0 && !submitted[idx] && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSubmitRating(idx);
                                            }}
                                            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                        >
                                            Submit Feedback
                                        </button>
                                    )}
                                    {submitted[idx] && (
                                        <p className="mt-2 text-green-600 text-sm">Feedback submitted!</p>
                                    )}
                                </div>
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
                            Your ratings and issue resolution status help us continuously improve our model by providing
                            insight into the quality and effectiveness of our feedback.
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