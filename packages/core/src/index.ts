import { DAuthHttpService } from "./services/http"
import { IDauthConfig } from "./types"

export default class DAuth {
    baseURL: string
    service: DAuthHttpService
    constructor(dauthConfig: IDauthConfig) { 
        this.baseURL = dauthConfig.baseURL
        this.service = new DAuthHttpService(dauthConfig)
    }
}