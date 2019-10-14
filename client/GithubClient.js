function GithubClient(token) {
    let state

    return { get }

    async function get(param, data) {
        let { url, options } = endpoints(param)
        // const TOKEN = localStorage.getItem('ghToken')
        
        if (options.Authorization && options.Authorization === 'token')
            options.Authorization += ` ${token}`

        let response = await fetch(url, options)

        if (response.status !== 200) {
            let statusCode = response.status
            let { message } = await response.json()
            let er = Error(message)
            er.code = statusCode
            throw er
        }
        
        return response
    }

    async function getToken(code) {
        let url = 'http://localhost:3000/token'
        // let url = 'https://us-central1-github-commit-schema.cloudfunctions.net/token'
        state = state || localStorage.getItem('ghStateToken')
        let body = `code=${code}&state=${state}`
        try {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                mode: 'cors',
                body
            })
            return await response.json()
        } catch (error) {
            throw error
        }
    }

    function endpoints(endpoint, params) {
        switch (endpoint) {
            case 'token':
                return {
                    url: 'http://localhost:3000/token',
                    options: {
                        method: 'POST',
                        body: `code=${params.code}&state=${params.state}`
                    }
                }
            case 'user':
                return {
                    url: 'https://api.github.com/user',
                    options: {
                        Authorization: 'token'
                    }
                }
            case 'repos':
                return {
                    url: `https://api.github.com/user/${params.login}/repos`,
                    options: {
                        Authorization: 'token'
                    }
                }
            default:
                return null
        }
    }
}

GithubClient.generateState = function() {
    let stateToken = btoa(Date.now() * Math.random()) + btoa(Date.now() - Math.random())
    stateToken = stateToken.replace(/[\W_]/g, '')
    return stateToken
}

export default GithubClient