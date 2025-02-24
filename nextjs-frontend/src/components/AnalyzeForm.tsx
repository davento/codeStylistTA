'use client'

import { useState, useRef } from 'react'
import InputForm from './InputForm'
import FeedbackSection from './FeedbackSection'
import { Loader2 } from 'lucide-react'

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

export default function AnalyzeForm() {
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

    const fileInputRef = useRef<HTMLInputElement>(null)

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
        if (fileInputRef.current) fileInputRef.current.value = ''
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
        setAnalysisDone(false)
        setFeedback([])
        setSuccess(false)

        if (!validateInput()) {
            return false
        }

        if (selectedFiles.length > 0) {
            setIsLoading(Array(selectedFiles.length).fill(LoadingState.ON_QUEUE))
        } else {
            setIsLoading([LoadingState.LOADING])
        }
        return true
    }

    const finishLoad = () => {
        setAnalysisDone(true)
        setIsLoading((prev) => prev.map(() => LoadingState.DONE))
    }

    const analyze = async (codeToAnalyze: string, index: number, fileName: string) => {
        if (codeToAnalyze.trim() === '') {
            setErrorLog('No code provided. Please upload a file or enter your code.')
            return Promise.reject()
        }

        const inputData = {
            code: codeToAnalyze,
            programming_language: selectedProgLang,
            course: selectedCourse,
            reply_tone: selectedTone,
            reply_format: selectedFormat,
        }

        setIsLoading((prev) => {
            const newState = [...prev]
            newState[index] = LoadingState.LOADING
            return newState
        })

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
                setFeedback((old) => [...old, { fileName, feedbackItems: data }])
                setSuccess(true)
            }
        } catch (error) {
            console.error(error)
            setErrorLog('Server error occurred.')
            setSuccess(false)
        }

        setIsLoading((prev) => {
            const newState = [...prev]
            newState[index] = LoadingState.DONE
            return newState
        })
    }

    const processFilesSequentially = async () => {
        for (let i = 0; i < selectedFiles.length; i++) {
            try {
                const content = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onload = () => resolve(reader.result as string)
                    reader.onerror = reject
                    reader.readAsText(selectedFiles[i])
                })
                await analyze(content, i, selectedFiles[i].name)
            } catch (error) {
                console.error(error)
            }
        }
    }

    const handleSubmit = async () => {
        const canSubmit = await startLoad()
        if (!canSubmit) return

        if (selectedFiles.length > 0) {
            await processFilesSequentially()
        } else {
            await analyze(code, 0, 'Code Input')
        }
        finishLoad()
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
                />
            </div>
        </div>
    )
}