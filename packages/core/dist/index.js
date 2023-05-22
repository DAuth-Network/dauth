import { DAuthHttpService } from "./services/http";
export default class DAuth {
    baseURL;
    service;
    constructor(baseURL = 'https://dev-api.dauth.network/dauth/sdk/v1.1/') {
        this.baseURL = baseURL;
        this.service = new DAuthHttpService(baseURL);
    }
}
