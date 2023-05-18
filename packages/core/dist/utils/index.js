export const isEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};
export const sleep = (ms = 1000) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};
