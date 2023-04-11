export const isEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}
export const sleep = (ms = 1000) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}