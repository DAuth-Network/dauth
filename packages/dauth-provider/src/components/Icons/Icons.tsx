import { FC, ReactNode } from 'react'

interface IIcons {
  children: ReactNode
  className?: string
}

const IconsWithBg: FC<IIcons> = ({ children, className }) => {
  return (
    <div className={`w-16 h-16 flex justify-center items-center  rounded-2xl ${className}`}>
      {children}
    </div>
  )
}

export default IconsWithBg
