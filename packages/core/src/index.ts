import DAuthHttpService from "./services/http/DAuthHttpService"
import DAuthHttpServiceV2 from "./services/http/DAuthHttpServiceV2"
import { IDauthConfig } from "./types"
export * from "./types"
export * from "./utils"
export default class DAuth {
    baseURL: string
    service: DAuthHttpService
    constructor(dauthConfig: IDauthConfig) { 
        this.baseURL = dauthConfig.baseURL
        if (dauthConfig.version === 2) {
            this.service = new DAuthHttpServiceV2(dauthConfig)
        } else {
            this.service = new DAuthHttpService(dauthConfig)
        }
    }
}