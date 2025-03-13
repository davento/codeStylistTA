'use client'

import { X, UploadCloud, Trash, AlertCircle } from 'lucide-react'
import courses from '@/data/courses.json'
import progLangs from '@/data/programming_languages.json'
import formats from '@/data/formats.json'
import tones from '@/data/tones.json'
import { useState, useEffect } from 'react'

interface InputFormProps {
    code: string
    setCode: React.Dispatch<React.SetStateAction<string>>
    selectedFiles: File[]
    setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>
    selectedProgLang: any
    setSelectedProgLang: React.Dispatch<any>
    selectedCourse: any
    setSelectedCourse: React.Dispatch<any>
    selectedTone: any
    setSelectedTone: React.Dispatch<any>
    selectedFormat: any
    setSelectedFormat: React.Dispatch<any>
    errorLog: string
    resetAll: () => void
    handleSubmit: () => void
    fileInputRef: React.RefObject<HTMLInputElement>
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    removeFile: (index: number) => void
    clearCode: () => void
    uploadCode: () => void
}

export default function InputForm({
                                      code,
                                      setCode,
                                      selectedFiles,
                                      setSelectedFiles,
                                      selectedProgLang,
                                      setSelectedProgLang,
                                      selectedCourse,
                                      setSelectedCourse,
                                      selectedTone,
                                      setSelectedTone,
                                      selectedFormat,
                                      setSelectedFormat,
                                      errorLog,
                                      resetAll,
                                      handleSubmit,
                                      fileInputRef,
                                      handleFileChange,
                                      removeFile,
                                      clearCode,
                                      uploadCode,
                                  }: InputFormProps) {
    const acceptType = selectedProgLang?.extensions?.join(',') || '*/*'
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)

    // Validate the form whenever relevant inputs change
    useEffect(() => {
        if (!hasAttemptedSubmit) return;

        validateForm();
    }, [code, selectedFiles, selectedProgLang, selectedCourse, selectedTone, selectedFormat, hasAttemptedSubmit]);

    // Form validation function
    const validateForm = () => {
        const errors: {[key: string]: string} = {};

        // Check if code or files are provided
        if (!code && selectedFiles.length === 0) {
            errors.input = "Please either enter code or upload files to analyze";
        }

        // Check configuration selections
        if (!selectedProgLang) {
            errors.language = "Please select a programming language";
        }

        if (!selectedCourse) {
            errors.course = "Please select a course";
        }

        if (!selectedTone) {
            errors.tone = "Please select a response tone";
        }

        if (!selectedFormat) {
            errors.format = "Please select an output format";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Custom submit handler with validation
    const submitWithValidation = () => {
        setHasAttemptedSubmit(true);
        const isValid = validateForm();

        if (isValid) {
            handleSubmit();
        }
    };

    return (
        <div className="w-full md:w-1/2 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Input Form</h1>
                <button
                    onClick={resetAll}
                    className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition"
                >
                    <Trash size={16} /> Reset All
                </button>
            </div>

            {/* Code/Text Input */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Code Input</h2>
                <textarea
                    className={`w-full p-3 border ${formErrors.input && !code ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                <h2 className="text-xl font-bold mb-4 text-gray-800">File Upload</h2>
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
                        className={`px-4 py-2 ${formErrors.input && selectedFiles.length === 0 && !code ? 'bg-red-100 text-red-800 border border-red-500' : 'bg-gray-200 text-gray-800'} rounded hover:bg-gray-300 transition`}
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
                    {formErrors.input && !code && selectedFiles.length === 0 && (
                        <div className="flex items-center gap-2 text-red-600 mt-2">
                            <AlertCircle size={16} />
                            <p className="text-sm">{formErrors.input}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Configuration */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Configuration</h2>
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
                                // Reset file list on language change
                                setSelectedFiles([])
                            }}
                            className={`mt-1 block w-full border ${formErrors.language ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md p-2`}
                        >
                            <option value="">Select language</option>
                            {progLangs.map((lang, index) => (
                                <option key={index} value={lang.name}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                        {formErrors.language && (
                            <p className="text-red-500 mt-1 text-sm">{formErrors.language}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Course</label>
                        <select
                            value={selectedCourse ? selectedCourse.name : ''}
                            onChange={(e) => {
                                const course = courses.find((c) => c.name === e.target.value)
                                setSelectedCourse(course)
                            }}
                            className={`mt-1 block w-full border ${formErrors.course ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md p-2`}
                        >
                            <option value="">Select course</option>
                            {courses.map((course, index) => (
                                <option key={index} value={course.name}>
                                    {course.name}
                                </option>
                            ))}
                        </select>
                        {formErrors.course && (
                            <p className="text-red-500 mt-1 text-sm">{formErrors.course}</p>
                        )}
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
                            className={`mt-1 block w-full border ${formErrors.tone ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md p-2`}
                        >
                            <option value="">Select tone</option>
                            {tones.map((tone, index) => (
                                <option key={index} value={tone.name}>
                                    {tone.name}
                                </option>
                            ))}
                        </select>
                        {formErrors.tone && (
                            <p className="text-red-500 mt-1 text-sm">{formErrors.tone}</p>
                        )}
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
                            className={`mt-1 block w-full border ${formErrors.format ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md p-2`}
                        >
                            <option value="">Select format</option>
                            {formats.map((format, index) => (
                                <option key={index} value={format.name}>
                                    {format.name}
                                </option>
                            ))}
                        </select>
                        {formErrors.format && (
                            <p className="text-red-500 mt-1 text-sm">{formErrors.format}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    onClick={submitWithValidation}
                    className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                    Evaluate
                </button>
            </div>
        </div>
    )
}