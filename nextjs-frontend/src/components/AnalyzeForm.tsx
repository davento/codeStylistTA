'use client'

import { useState, useRef } from 'react'
import { Loader2, X, UploadCloud, Trash } from 'lucide-react'
import FeedbackItem from './FeedbackItem'

// Import sample JSON data
import courses from '@/data/courses.json'
import progLangs from '@/data/programming_languages.json'
import formats from '@/data/formats.json'
import tones from '@/data/tones.json'

interface Feedback {
    error_location: string
    things_to_fix: string
    suggestions: string
    explanation: string
}

export enum LoadingState {
    NOTHING = 0,
    ON_QUEUE = 1,
    LOADING = 2,
    DONE = 3,
}

export default function AnalyzeForm() {
    // Main input states
    const [code, setCode] = useState('')
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [selectedProgLang, setSelectedProgLang] = useState<any>(null)
    const [selectedCourse, setSelectedCourse] = useState<any>(null)
    const [selectedTone, setSelectedTone] = useState<any>(null)
    const [selectedFormat, setSelectedFormat] = useState<any>(null)

    // Feedback states
    const [feedback, setFeedback] = useState<Feedback[][]>([])
    const [isLoading, setIsLoading] = useState<number[]>([LoadingState.NOTHING])
    const [errorLog, setErrorLog] = useState('')
    const [analysisDone, setAnalysisDone] = useState(false)
    const [success, setSuccess] = useState(false)
    const [hasSubmitted, setHasSubmitted] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)

    // Determine accepted file types based on the selected programming language.
    const acceptType = selectedProgLang?.extensions?.join(',') || '*/*'

    // Handle file selection and validate extensions
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (!files) return
        const fileArray = Array.from(files)
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
        setFeedback((fb) => fb.filter((_, i) => i !== index))
    }

    // Read file content asynchronously
    const readFileContent = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsText(file)
        })
    }

    // Clear the code input
    const clearCode = () => {
        setCode('')
    }

    // (Optional) Instant upload action when code changes
    const uploadCode = () => {
        alert('Code updated.')
    }

    // Prepares the UI state for submission
    const startLoad = async () => {
        setHasSubmitted(true)
        setErrorLog('')
        setAnalysisDone(false)
        setFeedback([])
        setSuccess(false)
        if (selectedFiles.length > 0) {
            setIsLoading(Array(selectedFiles.length).fill(LoadingState.ON_QUEUE))
        } else {
            setIsLoading([LoadingState.LOADING])
        }
    }

    // Called after processing completes
    const finishLoad = () => {
        setAnalysisDone(true)
        setIsLoading((prev) => prev.map(() => LoadingState.DONE))
    }

    // Send one analysis request to the API
    const analyze = async (codeToAnalyze: string, index: number) => {
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
                setFeedback((oldFeedback) => {
                    const newFeedback = [...oldFeedback]
                    newFeedback[index] = data
                    return newFeedback
                })
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

    // Process files sequentially if any exist
    const processFilesSequentially = async () => {
        for (let i = 0; i < selectedFiles.length; i++) {
            try {
                const content = await readFileContent(selectedFiles[i])
                await analyze(content, i)
            } catch (error) {
                console.error(error)
            }
        }
    }

    // Handles the submission process
    const handleSubmit = async () => {
        await startLoad()
        if (selectedFiles.length > 0) {
            await processFilesSequentially()
        } else {
            await analyze(code, 0)
        }
        finishLoad()
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="container mx-auto flex flex-col md:flex-row gap-6">
                {/* Left Side – Input Form */}
                <div className="w-full md:w-1/2 space-y-8">
                    {/* Code/Text Input */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h1 className="text-2xl font-bold mb-4 text-gray-800">Code Input</h1>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Paste your code here..."
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            rows={8}
                        ></textarea>
                        <div className="flex space-x-4 mt-4">
                            <button
                                onClick={clearCode}
                                className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition"
                            >
                                <X size={16} /> Clear
                            </button>
                            <button
                                onClick={uploadCode}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            >
                                <UploadCloud size={16} /> Upload Input
                            </button>
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h1 className="text-2xl font-bold mb-4 text-gray-800">File Upload</h1>
                        <div className="flex flex-col gap-2">
                            <input
                                type="file"
                                multiple
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                accept={acceptType}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                            >
                                Choose Files
                            </button>
                            {selectedFiles.length > 0 && (
                                <ul className="mt-2 space-y-1">
                                    {selectedFiles.map((file, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center justify-between border p-2 rounded-md bg-gray-50"
                                        >
                                            <span className="text-sm text-gray-700">{file.name}</span>
                                            <button
                                                onClick={() => removeFile(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {errorLog && <p className="text-red-500 mt-2 text-sm">{errorLog}</p>}
                        </div>
                    </div>

                    {/* Configuration */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h1 className="text-2xl font-bold mb-4 text-gray-800">Configuration</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Programming Language
                                </label>
                                <select
                                    value={selectedProgLang ? selectedProgLang.name : ''}
                                    onChange={(e) => {
                                        const lang = progLangs.find((l) => l.name === e.target.value)
                                        setSelectedProgLang(lang)
                                        // Reset file list when language changes.
                                        setSelectedFiles([])
                                    }}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                >
                                    <option value="">Select language</option>
                                    {progLangs.map((lang, index) => (
                                        <option key={index} value={lang.name}>
                                            {lang.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Course
                                </label>
                                <select
                                    value={selectedCourse ? selectedCourse.name : ''}
                                    onChange={(e) => {
                                        const course = courses.find((c) => c.name === e.target.value)
                                        setSelectedCourse(course)
                                    }}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                >
                                    <option value="">Select course</option>
                                    {courses.map((course, index) => (
                                        <option key={index} value={course.name}>
                                            {course.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Response Tone
                                </label>
                                <select
                                    value={selectedTone ? selectedTone.name : ''}
                                    onChange={(e) => {
                                        const tone = tones.find((t) => t.name === e.target.value)
                                        setSelectedTone(tone)
                                    }}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                >
                                    <option value="">Select tone</option>
                                    {tones.map((tone, index) => (
                                        <option key={index} value={tone.name}>
                                            {tone.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Output Format
                                </label>
                                <select
                                    value={selectedFormat ? selectedFormat.name : ''}
                                    onChange={(e) => {
                                        const format = formats.find((f) => f.name === e.target.value)
                                        setSelectedFormat(format)
                                    }}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                >
                                    <option value="">Select format</option>
                                    {formats.map((format, index) => (
                                        <option key={index} value={format.name}>
                                            {format.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSubmit}
                            className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                            Evaluate
                            {isLoading.every((state) => state === LoadingState.LOADING) && (
                                <Loader2 size={16} className="animate-spin" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Side – Feedback */}
                <div className="w-full md:w-1/2">
                    <div className="bg-white p-6 rounded-lg shadow h-full">
                        <h1 className="text-2xl font-bold mb-4 text-gray-800">Feedback</h1>
                        {/* Only show feedback area after submit */}
                        {hasSubmitted ? (
                            <>
                                {(!analysisDone || isLoading.some((state) => state !== LoadingState.DONE)) && !errorLog && (
                                    <div className="flex items-center gap-2">
                                        <Loader2 size={20} className="animate-spin" />
                                        <p className="text-gray-600">Analyzing code, please wait...</p>
                                    </div>
                                )}
                                {errorLog && (
                                    <div className="text-red-500">
                                        <p>{errorLog}</p>
                                    </div>
                                )}
                                {success && feedback.length > 0 && (
                                    <div className="space-y-4 mt-4">
                                        {feedback.map((fb, index) => (
                                            <FeedbackItem key={index} feedback={fb} loading={isLoading[index]} />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-500">Submit your code or files to see feedback.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}