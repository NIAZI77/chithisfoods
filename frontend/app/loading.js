import React from "react"

export default function Loading() {
    return (
        <div className='fixed inset-0 bg-white flex items-center justify-center h-full w-full overflow-hidden z-10'>
            <div className='loader'></div>
        </div>
    )
}