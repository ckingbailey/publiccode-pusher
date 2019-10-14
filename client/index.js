import Login from './components/Login.js'
import Form from './components/Form.js'
import GithubClient from './GithubClient.js'
import qs from './querystring.js'


(async function() {
    let root = document.getElementById('main')

    let app = new (function App(root) {
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
    
        let set = (curState, update) => {
            state = {
                ...curState,
                ...update
            }
        }
    
        let determineAuthState = ({ token }) => {
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
                    stateToken: state,
                    code,
                    authorization: 'PENDING'
                }
            }
    
            else return { authorization: 'LOGGED_OUT'}
        }
    
        let handleLoggedInState = async (curState) => {
            try {
                let ghClient = new GithubClient(curState.token)
                let { login } = await ghClient.get('user')
                let repos = await ghClient.get('repos')
                set(curState, {
                    username: login,
                    repos
                })
            } catch (error) {
                console.error(error)
                if (error.message === 'Requires authentication') {
                    set(curState, { warning: {
                        message: 'The application cannot read your repositories'
                        + ' because it does not have access to the necessary scopes.'
                        + ' Please consider logging in again and acceptiing'
                        + ' "user" and "public_repo" scopes.',
                        suggestion: 'REAUTHORIZE'
                    }})
                }
            }
        }
    
        let handlePendingAuthorization = async () => {
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
    
        let handlePrepareLogin = () =>  {
            let stateToken = GithubClient.generateState()
            set({ stateToken })
            localStorage.setItem('ghStateToken', stateToken)
        }
    
        let handleAuthState = async (curState) => {
            switch (state.authorization) {
                case 'LOGGED_IN':
                    return await handleLoggedInState(curState)
                case 'PENDING':
                    return handlePendingAuthorization(curState)
                default:
                    return handlePrepareLogin(curState)
            }
        }
    
        let setInitialState = () => {
            console.log('state, accordign to setInitState', state)
            set(state, determineAuthState(state))
        }
    
        let handleInitialState = async () => {
            console.log('state, according to handleInitSte', state)
            await handleAuthState(state)
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
            handleInstantiation: async function () {
                setInitialState()
                await handleInitialState()
                console.log('setted initial state', state)
        
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
    })(root)

    console.log(app)
    
    (await app.handleInstantiation()).render()
})()
