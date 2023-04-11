const CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID

export const githubLogin = async () => {
    const host = window.location.protocol + '//' +  window.location.host + '/oauth/github'
    
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${host}&scope=user`;
}