import Login from './components/Login.js'
import Form from './components/Form.js'
import GithubClient from './GithubClient.js'
import qs from './querystring.js'

new (function() {
    const CLIENT_ID = '8390933a81635970d3b6'
    let root = document.getElementById('main')
    let state = {
        token: null,
        username: null,
        authorization: 'LOGGED_OUT',
        stateToken: null,
        code: null,
        warning: null,
        error: null
    }

    setState(determineAuthState(state))
    console.log(state)

    handleAuthState(state)

    render(
        state.authorization === 'LOGGED_IN'
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
    )

    function determineAuthState({ token }) {
        token = token || localStorage.getItem('token')
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
                state,
                code,
                authorization: 'PENDING'
            }
        }

        else return { authorization: 'LOGGED_OUT'}
    }

    function handleAuthState({ authorization, token, code, stateToken }) {
        switch (authorization) {
            case 'LOGGED_IN':
                return handleLoggedInState(token)
            case 'PENDING':
                return handlePendingAuthorization(code, stateToken)
            default:
                return handlePrepareLogin()
        }
    }

    function handlePrepareLogin() {
        let stateToken = GithubClient.generateState()
        setState({ stateToken })
        localStorage.setItem('ghStateToken', stateToken)
    }

    async function handlePendingAuthorization(code, stateToken) {
        try {
            let { access_token } = await new GithubClient().get('token', {
                code,
                stateToken
            })
            setState({ token: access_token })
            localStorage.setItem('token', access_token)
        } catch (error) {
            console.error(error)
            setState({
                error,
                authorization: 'LOGGED_OUT'
            })
        }
    }
    
    async function handleLoggedInState(token) {
        try {
            let ghClient = new GithubClient(token)
            let { login } = await ghClient.get('user')
            let repos = await ghClient.get('repos')
            setState({
                username: login,
                repos
            })
        } catch (error) {
            console.error(error)
            if (error.message === 'Requires authentication') {
                setState({ warning: {
                        message: 'The application cannot read your repositories \
                        because it does not have access to the necessary scopes. \
                        Please consider logging in again and acceptiing \
                        "user" and "public_repo" scopes.',
                        suggestion: 'REAUTHORIZE'
                }})
            }
        }
    }

    function render(components) {
        for (let component of components) {
            root.appendChild(component)
        }
    }
    
    function setState(updateState) {
        return {
            ...state,
            ...updateState
        }
    }
})()
