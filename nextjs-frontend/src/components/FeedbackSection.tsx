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
    processingFiles: number
    totalFiles: number
    selectedFiles: File[] // Add this to get access to all file names
}

export default function FeedbackSection({
    hasSubmitted,
    feedback,
    isLoading,
    analysisDone,
    selectedTabIndex,
    setSelectedTabIndex,
    processingFiles,
    totalFiles,
    selectedFiles
}: FeedbackSectionProps) {
    // We don't wait for all files to be processed before showing feedback
    // Instead, we show feedback as it becomes available
    const hasAnyFeedback = feedback.length > 0

    // File processing status
    const filesCompletedCount = feedback.length
    const filesRemainingCount = processingFiles

    // Always show exactly 3 tabs
    const visibleTabCount = 3
    const [tabWindowStart, setTabWindowStart] = useState(0)

    // Get all tabs (both completed and still processing)
    const getAllTabs = () => {
        // Start with completed files
        const completedFiles = feedback.map(f => ({
            fileName: f.fileName,
            isProcessing: false,
            feedbackIndex: feedback.findIndex(item => item.fileName === f.fileName)
        }));

        // Add files that are still processing
        const processingFiles = selectedFiles
            .filter(file => !feedback.some(f => f.fileName === file.name))
            .map(file => ({
                fileName: file.name,
                isProcessing: true,
                feedbackIndex: -1
            }));

        // Add direct code input if it's processing
        const directInput = isLoading[0] === LoadingState.LOADING &&
                           !feedback.some(f => f.fileName === 'Code Input') &&
                           selectedFiles.length === 0
                           ? [{ fileName: 'Code Input', isProcessing: true, feedbackIndex: -1 }]
                           : [];

        return [...completedFiles, ...processingFiles, ...directInput];
    };

    const allTabs = hasSubmitted && analysisDone ? getAllTabs() : [];

    // Auto-select the most recently completed feedback tab (keep existing behavior)
    useEffect(() => {
        if (feedback.length > 0 && (selectedTabIndex >= feedback.length || selectedTabIndex === -1)) {
            setSelectedTabIndex(feedback.length - 1)
        } else if (analysisDone && selectedTabIndex === -1 && allTabs.length > 0) {
            // Set first tab as selected when processing starts
            setSelectedTabIndex(0)
        }
    }, [feedback.length, selectedTabIndex, setSelectedTabIndex, analysisDone, allTabs.length])

    // Adjust the window if the total number of tabs decreases
    useEffect(() => {
        if (tabWindowStart > Math.max(0, allTabs.length - visibleTabCount) && allTabs.length > 0) {
            setTabWindowStart(Math.max(0, allTabs.length - visibleTabCount))
        }
    }, [allTabs.length, tabWindowStart, visibleTabCount])

    const handleLeftArrow = () => {
        if (tabWindowStart > 0) {
            setTabWindowStart(tabWindowStart - 1)
        }
    }

    const handleRightArrow = () => {
        if (tabWindowStart + visibleTabCount < allTabs.length) {
            setTabWindowStart(tabWindowStart + 1)
        }
    }

    const visibleTabs = allTabs.slice(tabWindowStart, tabWindowStart + visibleTabCount)

    return (
        <div className="w-full md:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow h-full">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Feedback</h2>

                {/* Processing status message - always at the top */}
                {hasSubmitted && filesRemainingCount > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md">
                        <p>
                            {filesCompletedCount > 0 && (
                                <span>
                                    <span className="font-semibold">{filesCompletedCount}</span> of {totalFiles} files processed.{ }
                                </span>
                            )}
                            <span className="font-semibold">{filesRemainingCount}</span> file{filesRemainingCount !== 1 ? 's' : ''} still processing.
                            <br />
                            Results appear automatically as they become available.
                        </p>
                    </div>
                )}

                {/* When all files are processed but there were errors */}
                {hasSubmitted && filesRemainingCount === 0 && filesCompletedCount < totalFiles && totalFiles > 0 && (
                    <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-md">
                        <p>
                            All processing complete. <span className="font-semibold">{filesCompletedCount}</span> of {totalFiles} files processed successfully.
                        </p>
                    </div>
                )}

                {hasSubmitted ? (
                    allTabs.length > 0 ? (
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
                                        {visibleTabs.map((tab, idx) => {
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

                                                            <span
                                                                className="flex items-center justify-center w-full gap-2">
    <span className="truncate text-center">{tab.fileName}</span>
                                                                {tab.isProcessing && (
                                                                    <span
                                                                        className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                                                )}
</span>
                                                        </button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-2">
                                                    <p className="text-sm">{tab.fileName}</p>
                                                        {tab.isProcessing && (
                                                            <p className="text-xs text-blue-500">Processing...</p>
                                                        )}
                                                    </PopoverContent>
                                                </Popover>
                                            )
                                        })}
                                    </div>
                                </nav>
                                <button
                                    onClick={handleRightArrow}
                                    disabled={tabWindowStart + visibleTabCount >= allTabs.length}
                                    className="p-2 disabled:opacity-50 shrink-0"
                                >
                                    <ChevronRight size={20} className="text-gray-600" />
                                </button>
                            </div>
                            <div className="overflow-y-auto max-h-[130vh]">
                                {selectedTabIndex >= 0 && selectedTabIndex < allTabs.length && (
                                    allTabs[selectedTabIndex].isProcessing ? (
                                        <FeedbackSkeleton count={2} />
                                    ) : (
                                        <FeedbackItem
                                            fileName={feedback[allTabs[selectedTabIndex].feedbackIndex].fileName}
                                            feedback={feedback[allTabs[selectedTabIndex].feedbackIndex].feedbackItems}
                                            loading={LoadingState.DONE}
                                            tabIndex={selectedTabIndex}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    ) : (
                        // When no feedback is available yet but analysis has started
                        analysisDone ? (
                            <FeedbackSkeleton count={2} />
                        ) : (
                            <p className="text-gray-500">Processing your files. Please wait...</p>
                        )
                    )
                ) : (
                    <p className="text-gray-500">Submit your code or files to see feedback.</p>
                )}
            </div>
        </div>
    )
}