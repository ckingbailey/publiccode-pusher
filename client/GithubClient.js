function GithubClient(token) {
    return { get }

    async function get(param, data) {
        let { url, options } = endpoints(param, data)
        // const TOKEN = localStorage.getItem('ghToken')
        
        let response = await fetch(url, options)
        let json = await response.json()

        if (response.status !== 200) {
            let statusCode = response.status
            let { message } = response
            let er = Error(message)
            er.code = statusCode
            throw er
        }
        
        return json
    }

    function endpoints(endpoint, params) {
        switch (endpoint) {
            case 'token':
                return {
                    url: 'http://localhost:3000/token',
                    options: {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        body: `code=${params.code}&state=${params.stateToken}`
                    }
                }
            case 'user':
                return {
                    url: 'https://api.github.com/user',
                    options: {
                        headers: {
                            Authorization: `token ${token}`
                        }
                    }
                }
            case 'repos':
                return {
                    url: `https://api.github.com/users/${params.login}/repos`,
                    options: {
                        headers: {
                            Authorization: `token ${token}`
                        }
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