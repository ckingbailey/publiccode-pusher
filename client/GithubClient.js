export default function GithubClient(clientId) {
    function generateState() {
        return btoa(Date.now() * Math.random()) + btoa(Date.now() - Math.random())
    }

    function appendStateToAnchor(id) {
        let a = document.getElementById(id)
        let state = generateState()
        let href = `${a.getAttribute('href')}&state=${state}`
        a.setAttribute('href', href)
        storeStateString(state)
        return a
    }

    function storeStateString(str) {
        localStorage.setItem('ghStateToken', str)
    }

    async function getToken(code) {
        let url = 'https://github.com/login/oauth/access_token'
        let body = `client_id=${client_id}&code=${code}&client_secret=`
        try {
            let response = await fetch(url, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body
            })
            return (await response.json()).access_token
        } catch (er) {
            console.error(err)
            return null
        }
    }

    return {
        appendStateToAnchor,
        getToken
    }
}