import Login from './components/Login.js'
import Form from './components/Form.js'
import Loading from './components/Loading.js'
import GithubClient from './GithubClient.js'
import qs from './querystring.js'

function App(root) {
    function createChildren({ authorization, username, repos, stateToken, code }) {
        switch (authorization) {
            case 'LOGGED_IN':
                return [ new Form({ username, repos }) ]
            case 'LOGGED_OUT':
                return [ new Login({ stateToken, code }) ]
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

        // if no token, check for state and code
        let { state, code } = qs.parse()
        if (state
            && code
            && state === localStorage.getItem('state'))
        {
            return {
                authorization: 'PENDING',
                stateToken: state,
                code
            }
        }

        else return { authorization: 'LOGGED_OUT' }
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

            try {
                let { username, repos } = await retrieveUserData(this.state)

                this.state = {
                    ...this.state,
                    username,
                    repos
                }
            } catch (error) {
                console.error(error)
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