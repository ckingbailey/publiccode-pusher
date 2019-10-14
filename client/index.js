import Login from './components/Login.js'
import Form from './components/Form.js'
import GithubClient from './GithubClient.js'
import qs from './querystring.js'

let root = document.getElementById('main')

new function App(root) {
    const CLIENT_ID = '8390933a81635970d3b6'
    let state = {
        token: null,
        authorization: 'LOGGED_OUT',
        stateToken: null,
        code: null,
        username: null,
        repos: [],
        warning: null,
        error: null
    }

    let set = (update) => {
        state = {
            ...state,
            ...update
        }
    }

    let determineAuthState = (token) => {
        token = token || localStorage.getItem('token')
        console.log(token)
        if (token)
            return {
                token,
                authorization: 'LOGGED_IN'
            }

        // if no token, check for pending authorization
        let { state, code } = qs.parse()
        if (state
            && code
            && state === localStorage.getItem('ghStateToken'))
        {
            return {
                stateToken: state,
                code,
                authorization: 'PENDING'
            }
        }

        else return { authorization: 'LOGGED_OUT'}
    }

    let handleAuthState = () => {
        switch (state.authorization) {
            case 'LOGGED_IN':
                return handleLoggedInState()
            case 'PENDING':
                return handlePendingAuthorization()
            default:
                return handlePrepareLogin()
        }
    }

    let setInitialState = () => {
        let update = determineAuthState(state.token)
        console.log(update)
        set(update)
    }

    let handleInitialState = () => {
        handleAuthState()
    }

    let createComponents = () => {
        return state.authorization === 'LOGGED_IN'
        ? [ new Form({
            warning: { ...state.warning },
            username: state.username,
            repos: state.repos
        }) ]
        : [ new Login({
            error: state.error,
            client_id: CLIENT_ID,
            state: state.stateToken
        }) ]
    }

    return {
        handleInstantiation: function () {
            setInitialState()
            handleInitialState()
    
            return this
        },
        render: function () {
            let components = createComponents()

            for (let component of components) {
                root.appendChild(component)
            }
    
            return this
        }
    }

    async function handleLoggedInState() {
        try {
            let ghClient = new GithubClient(state.token)
            let { login } = await ghClient.get('user')
            let repos = await ghClient.get('repos')
            set({
                username: login,
                repos
            })
        } catch (error) {
            console.error(error)
            if (error.message === 'Requires authentication') {
                set({ warning: {
                    message: 'The application cannot read your repositories \
                    because it does not have access to the necessary scopes. \
                    Please consider logging in again and acceptiing \
                    "user" and "public_repo" scopes.',
                    suggestion: 'REAUTHORIZE'
                }})
            }
        }
    }

    async function handlePendingAuthorization() {
        try {
            let { access_token } = await new GithubClient().get('token', {
                code: state.code,
                stateToken: state.stateToken
            })
            set({ token: access_token })
            localStorage.setItem('token', access_token)
        } catch (error) {
            console.error(error)
            set({
                error,
                authorization: 'LOGGED_OUT'
            })
        }
    }

    function handlePrepareLogin() {
        let stateToken = GithubClient.generateState()
        set({ stateToken })
        localStorage.setItem('ghStateToken', stateToken)
    }
}(root).handleInstantiation().render()
