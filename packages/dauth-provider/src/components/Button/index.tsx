import React, { FC } from 'react'

interface IPrimaryButton {
  children: React.ReactNode
  onClick: () => void
  style?: React.CSSProperties
  className?: string
  disabled?: boolean
}

const Button: FC<IPrimaryButton> = ({ children, onClick, style, className, disabled }) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick()
    event.preventDefault()
  }
  return (
    <button
      className={`rounded-full bg-main h-14 ${className} disabled:cursor-not-allowed disabled:opacity-50 outline-none font-semibold`}
      disabled={disabled}
      style={style}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}

export default Button
