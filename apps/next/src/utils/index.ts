import * as  DAuth from "@dauth/core"

export const dauth = new DAuth.default({
    baseURL: 'https://dev-api.dauth.network/dauth/sdk/v1.1/',
    clientID: 'demo',
})

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

interface ObserveWindow {
    popup: Window;
    interval?: number;
    onClose: () => void;
}

export const observeWindow = ({ popup, interval, onClose }: ObserveWindow) => {
    const intervalId = setInterval(() => {
        if (popup.closed) {
            clearInterval(intervalId);
            onClose();
        }
    }, interval || 100);
};
interface OpenWindow {
    url: string;
    name?: string;
}
export const openWindow = ({ url, name }: OpenWindow) => {
    const top = (window.innerHeight - 400) / 2 + window.screenY;
    const left = (window.innerWidth - 400) / 2 + window.screenX;

    return window.open(
        url,
        name,
        `dialog=yes,top=${top}px,left=${left},width=${400}px,height=${500}px`
    );
};