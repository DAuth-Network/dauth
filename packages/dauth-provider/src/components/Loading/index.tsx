import React, { FC } from 'react'
import BeatLoader from "react-spinners/BeatLoader"
interface ILoading {
    text?: string
}
const Loading:FC<ILoading> = ({ text }) => {
    return (
        <div className="flex h-full flex-col justify-center items-center">
            <BeatLoader color="#fff" />
            <div className='text-center text-sm text-light-gray mt-6 '>
                {text}
            </div>
        </div>
    )
}

export default Loading