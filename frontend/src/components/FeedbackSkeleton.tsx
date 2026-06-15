'use client'

export default function FeedbackSkeleton({ count }: { count: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, idx) => (
                <div key={idx} className="bg-gray-100 p-4 rounded-md animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
            ))}
        </div>
    )
}