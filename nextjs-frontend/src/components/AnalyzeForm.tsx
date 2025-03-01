'use client'

import { useState, useRef, useEffect } from 'react'
import InputForm from './InputForm'
import FeedbackSection from './FeedbackSection'
import { Loader2 } from 'lucide-react'
import { useUser } from '@/context/UserContext'

export enum LoadingState {
    NOTHING = 0,
    ON_QUEUE = 1,
    LOADING = 2,
    DONE = 3,
}

export interface Feedback {
    error_location: string
    things_to_fix: string
    suggestions: string
    explanation: string
    codeSnippet?: string
}

export interface FileFeedback {
    fileName: string
    feedbackItems: Feedback[]
}

// Define the state structure for localStorage
interface StoredState {
    code: string
    selectedProgLang: any
    selectedCourse: any
    selectedTone: any
    selectedFormat: any
    feedback: FileFeedback[]
    isLoading: number[]
    analysisDone: boolean
    selectedTabIndex: number
    // We don't store files as they can't be serialized properly
}

export default function AnalyzeForm() {
    const { username } = useUser()
    const [code, setCode] = useState('')
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [selectedProgLang, setSelectedProgLang] = useState<any>(null)
    const [selectedCourse, setSelectedCourse] = useState<any>(null)
    const [selectedTone, setSelectedTone] = useState<any>(null)
    const [selectedFormat, setSelectedFormat] = useState<any>(null)
    const [feedback, setFeedback] = useState<FileFeedback[]>([])
    const [isLoading, setIsLoading] = useState<number[]>([LoadingState.NOTHING])
    const [errorLog, setErrorLog] = useState('')
    const [analysisDone, setAnalysisDone] = useState(false)
    const [success, setSuccess] = useState(false)
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [selectedTabIndex, setSelectedTabIndex] = useState(0)
    const [processingFiles, setProcessingFiles] = useState<number>(0)

    const fileInputRef = useRef<HTMLInputElement>(null)

    // Get storage key with username for better isolation between users
    const getStorageKey = () => `analyzeFormState_${username || 'anonymous'}`
    const getFeedbackStorageKey = () => `cached_feedback_${username || 'anonymous'}`

    // Load saved state from localStorage on initial render
    useEffect(() => {
        try {
            // Load form state
            const savedState = localStorage.getItem(getStorageKey())
            if (savedState) {
                const parsedState: StoredState = JSON.parse(savedState)

                setCode(parsedState.code || '')
                setSelectedProgLang(parsedState.selectedProgLang || null)
                setSelectedCourse(parsedState.selectedCourse || null)
                setSelectedTone(parsedState.selectedTone || null)
                setSelectedFormat(parsedState.selectedFormat || null)
                setIsLoading(parsedState.isLoading || [LoadingState.NOTHING])
                setAnalysisDone(parsedState.analysisDone || false)
                setSelectedTabIndex(parsedState.selectedTabIndex || 0)

                // If there's feedback, we must have submitted before
                if (parsedState.feedback && parsedState.feedback.length > 0) {
                    setHasSubmitted(true)
                }
            }

            // Load cached feedback (we load this separately to ensure it's always available)
            const cachedFeedback = localStorage.getItem(getFeedbackStorageKey())
            if (cachedFeedback) {
                const parsedFeedback: FileFeedback[] = JSON.parse(cachedFeedback)
                if (parsedFeedback && parsedFeedback.length > 0) {
                    setFeedback(parsedFeedback)
                    setHasSubmitted(true)
                    setAnalysisDone(true)
                    // Set all loaded feedback as DONE
                    setIsLoading(Array(parsedFeedback.length).fill(LoadingState.DONE))
                }
            }
        } catch (error) {
            console.error('Error loading saved state:', error)
            // Continue with default state if loading fails
        }
    }, [username])

    // Save state to localStorage whenever relevant state changes
    useEffect(() => {
        try {
            const stateToSave: StoredState = {
                code,
                selectedProgLang,
                selectedCourse,
                selectedTone,
                selectedFormat,
                feedback,
                isLoading,
                analysisDone,
                selectedTabIndex
            }
            localStorage.setItem(getStorageKey(), JSON.stringify(stateToSave))

            // Always cache feedback separately for better persistence
            if (feedback && feedback.length > 0) {
                localStorage.setItem(getFeedbackStorageKey(), JSON.stringify(feedback))
            }
        } catch (error) {
            console.error('Error saving state:', error)
        }
    }, [
        code,
        selectedProgLang,
        selectedCourse,
        selectedTone,
        selectedFormat,
        feedback,
        isLoading,
        analysisDone,
        selectedTabIndex,
        username
    ])

    // Reset All
    const resetAll = () => {
        setCode('')
        setSelectedFiles([])
        setSelectedProgLang(null)
        setSelectedCourse(null)
        setSelectedTone(null)
        setSelectedFormat(null)
        setFeedback([])
        setIsLoading([LoadingState.NOTHING])
        setErrorLog('')
        setAnalysisDone(false)
        setSuccess(false)
        setHasSubmitted(false)
        setSelectedTabIndex(0)
        setProcessingFiles(0)
        if (fileInputRef.current) fileInputRef.current.value = ''

        // Clear localStorage for this user
        localStorage.removeItem(getStorageKey())
        localStorage.removeItem(getFeedbackStorageKey())
    }

    // File change handler
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (!files) return
        const fileArray = Array.from(files)
        const acceptType = selectedProgLang?.extensions?.join(',') || '*/*'
        const validFiles = fileArray.filter((file) => {
            if (acceptType === '*/*') return true
            const extensions = acceptType.split(',').map((ext) => ext.trim().toLowerCase())
            const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
            return extensions.includes(fileExt)
        })
        if (validFiles.length === 0) {
            setErrorLog('None of the uploaded files were valid.')
        } else {
            setErrorLog('')
            setSelectedFiles((prev) => [...prev, ...validFiles])
        }
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const removeFile = (index: number) => {
        setSelectedFiles((files) => files.filter((_, i) => i !== index))
    }

    const clearCode = () => {
        setCode('')
    }

    const uploadCode = () => {
        alert('Code updated.')
    }

    const validateInput = (): boolean => {
        if (!code && selectedFiles.length === 0) {
            setErrorLog('Please enter some code or upload at least one file.')
            return false
        }
        if (!selectedProgLang || !selectedCourse || !selectedTone || !selectedFormat) {
            setErrorLog('Please complete all configuration fields.')
            return false
        }
        setErrorLog('')
        return true
    }

    const startLoad = async () => {
        setHasSubmitted(true)
        // Clear previous feedback for a new submission
        setFeedback([])
        setSuccess(false)

        if (!validateInput()) {
            return false
        }

        // Set all files to the LOADING state initially
        if (selectedFiles.length > 0) {
            setIsLoading(Array(selectedFiles.length).fill(LoadingState.LOADING))
            setProcessingFiles(selectedFiles.length)
        } else {
            setIsLoading([LoadingState.LOADING])
            setProcessingFiles(1)
        }

        // Set analysis done to true to show the loading UI immediately
        setAnalysisDone(true)

        return true
    }

    const finishLoad = () => {
        // Just make sure analysis done is set
        setAnalysisDone(true)
    }

    // Read a file and return its content
    const readFileContent = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsText(file)
        })
    }

    const analyze = async (codeToAnalyze: string, index: number, fileName: string) => {
        if (codeToAnalyze.trim() === '') {
            setErrorLog('No code provided. Please upload a file or enter your code.')
            setProcessingFiles(prev => Math.max(0, prev - 1))
            return Promise.reject()
        }

        const inputData = {
            code: codeToAnalyze,
            programming_language: selectedProgLang,
            course: selectedCourse,
            reply_tone: selectedTone,
            reply_format: selectedFormat,
        }

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/input', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputData),
            })
            const data = await response.json()
            if (data.error) {
                setErrorLog(data.error)
                setSuccess(false)
            } else {
                // Update feedback and cache it
                const newFeedback = { fileName, feedbackItems: data };
                setFeedback(old => {
                    const newFeedbackArray = [...old, newFeedback];
                    // Cache the feedback immediately
                    localStorage.setItem(getFeedbackStorageKey(), JSON.stringify(newFeedbackArray));
                    return newFeedbackArray;
                });
                setSuccess(true)
            }
        } catch (error) {
            console.error(error)
            setErrorLog(`Server error occurred when processing ${fileName}.`)
            setSuccess(false)
        }

        // Mark this file as done and reduce the count of processing files
        setIsLoading((prev) => {
            const newState = [...prev]
            newState[index] = LoadingState.DONE
            return newState
        })

        setProcessingFiles(prev => Math.max(0, prev - 1))
    }

    // Process all files simultaneously
    const processFiles = async () => {
        // Process all files in parallel
        const processPromises = selectedFiles.map(async (file, index) => {
            try {
                const content = await readFileContent(file)
                await analyze(content, index, file.name)
            } catch (error) {
                console.error(`Error processing file ${file.name}:`, error)
                setProcessingFiles(prev => Math.max(0, prev - 1))
            }
        })

        // Wait for all files to complete (this doesn't block rendering)
        await Promise.allSettled(processPromises)

        // All processing is done
        finishLoad()
    }

    const handleSubmit = async () => {
        const canSubmit = await startLoad()
        if (!canSubmit) return

        if (selectedFiles.length > 0) {
            // Process all files in parallel
            processFiles()
        } else {
            // Direct code input
            await analyze(code, 0, 'Code Input')
            finishLoad()
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="container mx-auto flex flex-col md:flex-row gap-6">
                <InputForm
                    code={code}
                    setCode={setCode}
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                    selectedProgLang={selectedProgLang}
                    setSelectedProgLang={setSelectedProgLang}
                    selectedCourse={selectedCourse}
                    setSelectedCourse={setSelectedCourse}
                    selectedTone={selectedTone}
                    setSelectedTone={setSelectedTone}
                    selectedFormat={selectedFormat}
                    setSelectedFormat={setSelectedFormat}
                    errorLog={errorLog}
                    resetAll={resetAll}
                    handleSubmit={handleSubmit}
                    fileInputRef={fileInputRef}
                    handleFileChange={handleFileChange}
                    removeFile={removeFile}
                    clearCode={clearCode}
                    uploadCode={uploadCode}
                />
                <FeedbackSection
                    hasSubmitted={hasSubmitted}
                    feedback={feedback}
                    isLoading={isLoading}
                    analysisDone={analysisDone}
                    selectedTabIndex={selectedTabIndex}
                    setSelectedTabIndex={setSelectedTabIndex}
                    processingFiles={processingFiles}
                    totalFiles={selectedFiles.length}
                />
            </div>
        </div>
    )
}