import GoogleIcons from './GoogleIcons'
import EmailIcon from './EmailIcon'
import { ISupportedIcons } from '../../types'
import TwitterIcon from './TwitterIcon'
import GithubIcon from './GithubIcon'
import FaceBookIcon from './FaceBookIcon'

const supportedIcons = ['google', 'email', 'twitter']

const icons = {
  google: GoogleIcons,
  email: EmailIcon,
  twitter: TwitterIcon,
  github: GithubIcon,
  facebook: FaceBookIcon,
}

export const getIcons = (name: ISupportedIcons) => {
  return icons[name]
}
