'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import FeedbackItem from './FeedbackItem'
import FeedbackSkeleton from './FeedbackSkeleton'
import { LoadingState } from './AnalyzeForm'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface FileFeedback {
    fileName: string
    feedbackItems: any[]
}

interface FeedbackSectionProps {
    hasSubmitted: boolean
    feedback: FileFeedback[]
    isLoading: number[]
    analysisDone: boolean
    selectedTabIndex: number
    setSelectedTabIndex: React.Dispatch<React.SetStateAction<number>>
}

export default function FeedbackSection({
                                            hasSubmitted,
                                            feedback,
                                            isLoading,
                                            analysisDone,
                                            selectedTabIndex,
                                            setSelectedTabIndex,
                                        }: FeedbackSectionProps) {
    const feedbackLoading = !analysisDone || isLoading.some((state) => state !== LoadingState.DONE)

    // Always show exactly 3 tabs
    const visibleTabCount = 3
    const [tabWindowStart, setTabWindowStart] = useState(0)

    // Adjust the window if the total number of tabs decreases
    useEffect(() => {
        if (tabWindowStart > feedback.length - visibleTabCount) {
            setTabWindowStart(Math.max(0, feedback.length - visibleTabCount))
        }
    }, [feedback.length, tabWindowStart])

    const handleLeftArrow = () => {
        if (tabWindowStart > 0) {
            setTabWindowStart(tabWindowStart - 1)
        }
    }

    const handleRightArrow = () => {
        if (tabWindowStart + visibleTabCount < feedback.length) {
            setTabWindowStart(tabWindowStart + 1)
        }
    }

    const visibleTabs = feedback.slice(tabWindowStart, tabWindowStart + visibleTabCount)

    return (
        <div className="w-full md:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow h-full">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Feedback</h2>
                {hasSubmitted ? (
                    feedbackLoading ? (
                        <FeedbackSkeleton count={6} />
                    ) : feedback.length > 0 ? (
                        <div>
                            <div className="mb-4 border-b flex items-center">
                                <button
                                    onClick={handleLeftArrow}
                                    disabled={tabWindowStart === 0}
                                    className="p-2 disabled:opacity-50 shrink-0"
                                >
                                    <ChevronLeft size={20} className="text-gray-600" />
                                </button>
                                <nav className="flex flex-grow overflow-hidden">
                                    <div className="grid grid-cols-3 w-full">
                                        {visibleTabs.map((fileFeedback, idx) => {
                                            const globalIndex = tabWindowStart + idx
                                            return (
                                                <Popover key={globalIndex}>
                                                    <PopoverTrigger asChild>
                                                        <button
                                                            onClick={() => setSelectedTabIndex(globalIndex)}
                                                            className={`relative py-2 group ${
                                                                selectedTabIndex === globalIndex
                                                                    ? 'border-b-2 border-blue-500 text-blue-500'
                                                                    : 'text-gray-600'
                                                            }`}
                                                        >
                                                            <span className="block truncate px-2">
                                                                {fileFeedback.fileName}
                                                            </span>
                                                        </button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-2">
                                                        <p className="text-sm">{fileFeedback.fileName}</p>
                                                    </PopoverContent>
                                                </Popover>
                                            )
                                        })}
                                    </div>
                                </nav>
                                <button
                                    onClick={handleRightArrow}
                                    disabled={tabWindowStart + visibleTabCount >= feedback.length}
                                    className="p-2 disabled:opacity-50 shrink-0"
                                >
                                    <ChevronRight size={20} className="text-gray-600" />
                                </button>
                            </div>
                            <div className="overflow-y-auto max-h-[110vh]">
                                <FeedbackItem
                                    fileName={feedback[selectedTabIndex].fileName}
                                    feedback={feedback[selectedTabIndex].feedbackItems}
                                    loading={isLoading[selectedTabIndex] || LoadingState.DONE}
                                />
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">No feedback available.</p>
                    )
                ) : (
                    <p className="text-gray-500">Submit your code or files to see feedback.</p>
                )}
            </div>
        </div>
    )
}