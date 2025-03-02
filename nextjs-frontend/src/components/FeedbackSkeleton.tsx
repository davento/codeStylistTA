'use client'

interface FeedbackSkeletonProps {
    count: number
}

export default function FeedbackSkeleton({ count }: FeedbackSkeletonProps) {
    const skeletons = Array.from({ length: count }, (_, idx) => idx)
    return (
        <div className="space-y-4">
            {skeletons.map((item) => (
                <div key={item} className="bg-gray-100 p-4 rounded-md space-y-2 animate-pulse">
                    <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
                    <div className="h-3 w-full bg-gray-300 rounded"></div>
                    <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
                    <div className="h-3 w-full bg-gray-300 rounded"></div>
                    <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
                    <div className="h-3 w-full bg-gray-300 rounded"></div>
                    <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
                    <div className="h-3 w-full bg-gray-300 rounded"></div>
                </div>
            ))}
        </div>
    )
}