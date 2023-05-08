import { FC } from 'react'
import LogoImg from './logo.png'
interface ILogo {
  className?: string
}

const Logo: FC<ILogo> = ({ className }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img src={LogoImg} width={18} />
      <div className="ml-2 text-lg">DAuth Network</div>
    </div>
  )
}

export default Logo
