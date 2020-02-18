function GithubClient(token) {
    const TOKEN_SERVER = 'http://localhost:5000/token'
    return { get }

    async function get(endpoint, data) { // I think the answer here is to have this guy take a callback instead
        let { url, options } = getRequestParamsForEndpoint(endpoint, data)
        let res = await fetch(url, options)
        let json = await res.json()

        // if bad HTTP repsonse, construct a nice error, and throw it
        if (!res.ok) {
            let { message } = json
            let er = Error(message)
            er.code = res.status
            throw er
        }

        return res
    }

    function getRequestParamsForEndpoint(endpoint, params) {
        switch (endpoint) {
            case 'permission':
                return {
                    url: `https://api.github.com/repos/${params.owner}/${params.repo}/collaborators/${params.user}/permission`,
                    options: {
                        mode: 'cors',
                        method: 'GET',
                        headers: {
                            Authorization: `token ${token}`
                        }
                    }
                }
            case 'token':
                return {
                    url: TOKEN_SERVER,
                    options: {
                        mode: 'cors',
                        method: 'POST',
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        body: `code=${params.code}`
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
    return getRandomString(40)
}

function getRandomString(len) {
    const MAXLEN = Math.floor(len * 2.5)

    function genStr() {
        let uint16 = new Uint16Array(MAXLEN)
    
        window.crypto.getRandomValues(uint16)
    
        return Array
        .from(uint16, n => charCodeIsInSafeRange(n) && String.fromCharCode(n))
        .filter(char => char)
        .join('')
    }

    let str = genStr()

    while (str.length < len) str += genStr()

    return str.slice(0, len)
}

// test if character is one of the set [ -_+0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ]
var charCodeIsInSafeRange = num =>
    [43,45,48,49,50,51,52,53,54,55,56,57,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,95,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122]
    .includes(num)

export default GithubClient