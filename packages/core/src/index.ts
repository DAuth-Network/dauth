import { DAuthHttpService } from "./services/http"

class DAuth {
    baseURL: string
    httpService: DAuthHttpService
    constructor(baseURL = '') { 
        this.baseURL = baseURL
        this.httpService = new DAuthHttpService(baseURL)
    }
    


}