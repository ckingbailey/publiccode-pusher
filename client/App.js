import Login from './components/Login.js'
import Form from './components/Form.js'
import Banner from './components/Banner.js'
import Loading from './components/Loading.js'
import GithubClient from './GithubClient.js'
import qs from './querystring.js'

function App(root) {
    const client_id = '8390933a81635970d3b6'

    function createChildren({
        authorization,
        username,
        repos,
        stateToken,
        code,
        warningSuggestion
    }) {
        switch (authorization) {
            case 'LOGGED_IN':
                let components = [ new Form({ username, repos }) ]
                if (warningSuggestion)
                    components.unshift(
                        new Banner({
                            type: 'warning',
                            text: warningSuggestion
                        },
                            [ new Login({
                                text: 'Login in again',
                                id: 'gh-login',
                                client_id,
                                stateToken,
                                code
                            }) ]
                        )
                    )
                return components
            case 'LOGGED_OUT':
                return [ new Login({
                    text: 'Login to Github',
                    id: 'gh-login',
                    client_id,
                    stateToken,
                    code
                }) ]
            case 'PENDING':
                return [ new Loading() ]
            default:
                return [ new Login({ stateToken, code }) ]
        }
    }

    function attachChildren(children) {
        for (let component of children) {
            root.appendChild(component)
        }
    }

    function determineAuthState({ token }) {
        // try to get token
        token = token || localStorage.getItem('token')
        if (token) {
            return {
                token,
                authorization: 'LOGGED_IN'
            }
        }

        // if no token, check for state and code in querystring
        let { state, code } = qs.parse()
        console.log(state, code)
        if (state
            && code
            && state === localStorage.getItem('ghStateToken'))
        {
            console.log(localStorage.getItem('ghStateToken'))
            console.log('determine auth state is PENDING')
            return {
                authorization: 'PENDING',
                stateToken: state,
                code
            }
        }

        else return { authorization: 'LOGGED_OUT' }
    }

    async function handleAuthState({ authorization, stateToken, code }) {
        switch (authorization) {
            case 'PENDING':
                console.log('case PENDING')
                try {
                    return await (new GithubClient()).get('token', { stateToken, code })
                } catch (error) {
                    console.error(error)
                    localStorage.removeItem('ghStateToken')
                    return {
                        stateToken: null,
                        code: null,
                        error: error.message,
                        authorization: 'LOGGED_OUT'
                    }
                }
            case 'LOGGED_IN':
                try {
                    let { username, repos } = await retrieveUserData(this.state)
    

                    return {
                        username,
                        repos
                    }
                } catch (error) {
                    console.error(error)
                    let stateToken = GithubClient.generateState()
                    localStorage.setItem('ghStateToken', stateToken)
                    localStorage.removeItem('token')
    
                    return {
                        stateToken,
                        warningMessage: error.message,
                        warningSuggestion: 'Could not retrieve your repos.'
                        + ' Please consider logging in again'
                        + ' and approving "user:read" and "public_repo" scopes'
                    }
                }
            case 'LOGGED_OUT': {
                console.log('case LOGGED_OUT')
                let stateToken = GithubClient.generateState()
                localStorage.setItem('ghStateToken', stateToken)

                return { stateToken }
            }
        }
    }

    async function retrieveUserData({ token }) {
        let ghClient = new GithubClient(token)
        let { login } = await ghClient.get('user')
        let repos = await ghClient.get('repos', { login })

        return { username: login, repos }
    }

    return {
        state: {
            token: null,
            authorization: 'PENDING',
            stateToken: null,
            code: null,
            username: null,
            repos: [],
            warningMessage: null,
            warningSuggestion: null,
            errorMessage: null,
            errorSuggestion: null
        },
        initialize: async function() {
            let authState = determineAuthState(this.state)
            this.state = {
                ...this.state,
                ...authState
            }

            let result = await handleAuthState(this.state)
            this.state = {
                ...this.state,
                ...result
            }

            return this
        },
        render: function() {
            let children = createChildren(this.state)
            attachChildren(children)
            return this
        }
    }
}

export default App