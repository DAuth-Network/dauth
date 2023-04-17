export interface ISignInMethodItem {
  name: string
  title: string
  description: string
}

export type ISupportedIcons = 'google' | 'email' | 'twitter'

export enum EStep {
  default,
  exchange,
  encrypt,
  hiding,
  success,
}
