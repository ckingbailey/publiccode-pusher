import React, { Component } from "react"
import { connect } from "react-redux";

import {
    setStateToken,
    setAuthToken,
    exchangeCodeForToken,
    setAuthorize,
    fetchUserPermission
} from '../store/auth'

import Editor from './editor'
import Login from './Login'

import Gh from '../utils/GithubClient'

const mapStateToProps = state => ({
    authenticated: state.auth.authenticated,
    authorized: state.auth.authorized,
    ghAuthToken: state.auth.ghAuthToken
})

let mapDispatchToProps = dispatch => ({
    setAuthToken: token => dispatch(setAuthToken(token)),
    exchangeCodeForToken: (stateToken, code) => dispatch(exchangeCodeForToken(stateToken, code)),
    setStateToken: stateToken => dispatch(setStateToken(stateToken)),
    setAuthorize: bool => dispatch(setAuthorize(bool)),
    fetchUserPermission: (token, owner, repo) => dispatch(fetchUserPermission(token, owner, repo))
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
        if (this.props.authenticated === true && storedToken) {
            return { verdict: 'authenticated' }
        } else if (this.props.ghAuthToken) {
            return {
                verdict: 'newly_authenticated',
                payload: this.props.ghAuthToken
            }
        } else if (storedToken) {
            return {
                verdict: 'previously_authenticated',
                payload: storedToken
            }
        }

        // if no ghAuthToken found anywhere, check for gh state token & code
        let { code, stateToken } = this.getCodeAndStateFromQs(window.location.search)
        let storedStateToken = window.sessionStorage.getItem('GH_STATE_TOKEN')
        if (code && stateToken && storedStateToken && stateToken === storedStateToken) return {
            verdict: 'pending',
            payload: code
        }

        return {
            verdict: 'not_authenticated'
        }
    }

    /**
    * 1. check for GH auth token on sessionStorage and Redux store
    *    - if present, user is authorized
    * 2. if no GH auth token, check for [ GH state token, code ] in `qs` & [ GH state token ] in `sessionStorage`
    *    - if found, user is mid-auth-flow, exchange GH code for auth token
    * 3. if no [ GH state token | code ] on `qs` or no [ GH state token ] in `sessionStorage`, user has yet to authorize
    *    - generate Gh state token, hold it in state & save it in sessionStorage
    */
    async handleAuthState({ verdict, payload }) {
        // TODO: handle permutations and combinations of `authorized` w/ `authenticated`
        if (verdict === 'authenticated') return
        else if (verdict === 'previously_authenticated') {
            this.props.setAuthToken(payload)
        } else if (verdict === 'newly_authenticated') {
            this.storeTokenLocally('GH_AUTH_TOKEN', payload)
            let target = window.sessionStorage.getItem('target_repo') // grab repo url that was stored at start of login
            console.log(`found target repo in storage: ${target}`)
            let [ owner, repo ] = target.replace(/https*:\/\/github.com\//, '').split('/')
            console.log(`extracted owner and repo from target: ${owner}, ${repo}`)
            this.props.fetchUserPermission(this.props.ghAuthToken, owner, repo)
        } else if (verdict === 'pending') {
            window.history.replaceState('publiccode-pusher login', '', '/')
            window.sessionStorage.removeItem('GH_STATE_TOKEN')
            this.props.exchangeCodeForToken(payload)
        } else {
            const ghStateToken = Gh.generateState()
            window.sessionStorage.setItem('GH_STATE_TOKEN', ghStateToken)
            this.props.setStateToken(ghStateToken)
        }
    }

    // This function handles the case of trying to store undefined in browser storage
    // by not storing undefined, or NaN, or null
    storeTokenLocally(key, token) {
        if (token || token === 0) {
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
     * - if auth token found on window storage and not on redux store:
     *   - use setAuthToken to set auth token on store; handle effect in cmptDidUpdate()
     * - no auth token, check for state token and code, and exchange code for auth token
     * - if none of the above found, show login prompt
     */
    componentDidMount() {
        this.handleAuthState(this.checkAuthState())
    }

    componentDidUpdate() {
        let { verdict, payload } = this.checkAuthState()
        if (!(verdict === 'authenticated' && this.props.authorized)) {
            this.handleAuthState({ verdict, payload })
        }
    }

    render() {
        return (
            this.props.authenticated
            ? <Editor/>
            : <Login/>
        )
    }
}

export default Index
