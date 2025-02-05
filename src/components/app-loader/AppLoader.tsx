import { Loader2 } from 'lucide-react'
import React from 'react'

const AppLoader = ({ className }: { className?: string }) => {
    return (
        <div className={`flex items-center justify-center w-full  h-[350px] ${className}`}>
            <Loader2 className="mr-2 h-[50px]  align-middle animate-spin" />
        </div>
    )
}

export default AppLoader