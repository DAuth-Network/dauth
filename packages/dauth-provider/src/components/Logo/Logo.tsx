import React, { FC } from 'react'

interface ILogo {
  className?: string
}

const Logo: FC<ILogo> = ({ className }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img src={require('./logo.png')} width={18} />
      <div className="ml-2 text-lg">DAuth Network</div>
    </div>
  )
}

export default Logo
