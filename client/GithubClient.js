export default function GithubClient(clientId) {
    let state

    function generateState() {
        state = btoa(Date.now() * Math.random()) + btoa(Date.now() - Math.random())
        state = state.replace(/[\W_]/g, '')
        console.log('generate new state', state)
        return state
    }

    function appendStateToAnchor(id) {
        let a = document.getElementById(id)
        state = generateState()
        let href = `${a.getAttribute('href')}&state=${state}`
        a.setAttribute('href', href)
        storeStateString(state)
        return a
    }

    function storeStateString(str) {
        localStorage.setItem('ghStateToken', str)
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

    return {
        appendStateToAnchor,
        getToken
    }
}