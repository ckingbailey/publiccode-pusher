import React, { Component } from "react"
import { connect } from "react-redux";

import {
    setStateToken,
    setAuthToken,
    exchangeCodeForToken,
    setAuthorize
} from '../store/auth'

import Editor from './editor'
import Login from './Login'

import Gh from '../utils/GithubClient'

const mapStateToProps = state => ({
    ghAuthToken: state.auth.ghAuthToken
})

let mapDispatchToProps = dispatch => ({
    setAuthToken: token => dispatch(setAuthToken(token)),
    exchangeCodeForToken: (stateToken, code) => dispatch(exchangeCodeForToken(stateToken, code)),
    setStateToken: stateToken => dispatch(setStateToken(stateToken)),
    setAuthorize: bool => dispatch(setAuthorize(bool))
})

@connect (
    mapStateToProps,
    mapDispatchToProps
)
class Index extends Component {
    constructor() {
        super()
        this.state = {
            ghStateToken: null
        }
    }

    checkAuthState() {
        let storedToken = window.sessionStorage.getItem('GH_AUTH_TOKEN')

        // if auth token found, 'AUTHENTICATED'
        if (storedToken || this.props.ghAuthToken !== null) return {
            verdict: 'AUTHENTICATED', // TODO: if this is mount, store sessionStorage token on store state
            payload: storedToken || this.props.ghAuthToken
        }

        // if no ghAuthToken found anywhere, check for gh state token & code
        let { code, stateToken } = this.getCodeAndStateFromQs(window.location.search)
        let storedStateToken = window.sessionStorage.getItem('GH_STATE_TOKEN')
        if (code && stateToken && storedStateToken && stateToken === storedStateToken) {
            console.log(`code being passed out of checkAuthState is ${code}`)
             return {
            verdict: 'PENDING',
            payload: code
        }}

        return false
    }

    /**
    * 1. check for GH auth token on sessionStorage and Redux store
    *    - if present, user is authorized
    * 2. if no GH auth token, check for [ GH state token, code ] in `qs` & [ GH state token ] in `sessionStorage`
    *    - if found, user is mid-auth-flow, exchange GH code for auth token
    * 3. if no [ GH state token | code ] on `qs` or no [ GH state token ] in `sessionStorage`, user has yet to authorize
    *    - generate Gh state token, hold it in state & save it in sessionStorage
    */
    async handleAuthState(authState) {
        console.log(`handleAuthState received ${JSON.stringify(authState, null, 2)}`)
        if (authState.verdict === 'AUTHENTICATED') {
            // if token is stored in session but not on redux store, set it on redux store
            if (this.props.ghAuthToken === null) {
                this.props.setAuthToken(authState.payload)
            }
            // if ghAuthToken is on store but not on sessionStorage, we gotta store it on sessionStorage
            else if (!window.sessionStorage.getItem('GH_AUTH_TOKEN')) {
                this.storeTokenLocally('GH_AUTH_TOKEN', this.props.ghAuthToken)
            }

            // Check user permissions on target repo
            await this.checkUserPermission()
        } else if (authState.verdict === 'PENDING') {
            window.history.replaceState('publiccode-pusher login', '', '/')
            this.props.exchangeCodeForToken(authState.payload)
        } else {
            const ghStateToken = Gh.generateState()
            sessionStorage.setItem('GH_STATE_TOKEN', ghStateToken)
            this.props.setStateToken(ghStateToken)
        }
    }

    async checkUserPermission() {
        let target = window.sessionStorage.getItem('target_repo') // grab repo url that was stored at start of login
        let [ owner, repo ] = target.replace(/http(?:s):\/\/github.com\//g, '').split('/')
        let gh = new Gh(this.props.ghAuthToken)
        let { login } = await gh.get('user')
        let { permission } = await gh.get('permission', { owner, repo, login })
        let permissible = [ 'write', 'maintain', 'admin' ]
        if (permissible.includes(permission)) {
            this.props.setAuthorize(true)
        }
    }

    // This function handles the case of trying to store undefined in browser storage
    // by not storing undefined, or NaN, or null
    storeTokenLocally(key, token) {
        if (token !== undefined && !isNaN(token) && token !== null) {
            window.sessionStorage.setItem(key, token)
            return token
        }
        return false
    }

    getCodeAndStateFromQs(qs) {
        qs = qs.slice(1)
        if (!qs) return false
        let params = qs.split('&')

        let code = params.find(param => param.startsWith('code='))
        code = code && decodeURI(code.split('=')[1])

        let stateToken = params.find(param => param.startsWith('state='))
        stateToken = stateToken && decodeURI(stateToken.split('=')[1])

        return { code, stateToken }
    }

    /**
     * When component mounts check where we're at in the auth flow
     * - if auth token found, check repo permissions
     * - no auth token, check for state token and code, and exchange code for auth token
     * - if none of the above found, show login prompt
     */
    componentDidMount() {
        this.handleAuthState(this.checkAuthState())
    }

    render() {
        return (
            this.props.ghAuthToken
            ? <Editor/>
            : <Login/>
        )
    }
}

export default Index
