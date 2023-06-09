import { FC } from 'react'
import { ISignInMethodItem, ISupportedIcons } from '../../types'
import { getIcons } from '../Icons'

interface ISignInItem {
  item: ISignInMethodItem,
  onClick: (item: ISignInMethodItem) => void
}

const SignInItem: FC<ISignInItem> = ({ item, onClick }) => {
  const Icon = getIcons(item.name as ISupportedIcons)
  return (
    <div className="flex gap-4 py-4 border-b max-w-sm border-dark-grey cursor-pointer " onClick={() => {onClick(item)}}>
      <Icon />
      <div className="flex flex-col justify-center">
        <div className="font-semibold">{item.title}</div>
        <div className="">{item.description}</div>
      </div>
    </div>
  )
}

export default SignInItem
