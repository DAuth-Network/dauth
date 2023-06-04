import { DAuthHttpService } from "./services/http"

export default class DAuth {
    baseURL: string
    service: DAuthHttpService
    constructor(baseURL: string) { 
        this.baseURL = baseURL
        this.service = new DAuthHttpService(baseURL)
    }
}