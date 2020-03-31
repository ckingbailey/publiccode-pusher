import React, { Component } from "react"
import { connect } from "react-redux";

import {
    setStateToken,
    setAuthToken,
    exchangeCodeForToken
} from '../store/authenticate'
import { setAuthorize, fetchUserPermission } from '../store/authorize'

import Editor from './editor'
import LoadScreen from './LoadScreen'
import Login from './Login'

import Gh from '../utils/GithubClient'

const mapStateToProps = state => ({
    authenticateError: state.authenticate.error,
    authenticateFetching: state.authenticate.isFetching,
    authenticated: state.authenticate.authenticated,
    authorizeError: state.authorize.error,
    authorizeFetching: state.authorize.isFetching,
    authorized: state.authorize.authorized,
    ghAuthToken: state.authenticate.ghAuthToken,
    targetRepo: state.authorize.targetRepo
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
    constructor(props) {
        super(props)
        this.state = {
            ghStateToken: null
        }
    }

    checkAuthState() {
        let access_token = window.sessionStorage.getItem('GH_ACCESS_TOKEN')
        let target_repo = window.sessionStorage.getItem('target_repo')

        // first case can only occur on cmpntDidUpdate()
        // if auth token found in store.state and stored on browser, 'authenticated'
        if (this.props.authenticated === true && access_token) {
            return { verdict: 'authenticated' }
        } else if (access_token && target_repo) {
            // this case should only occur on returning to page within same browser sesh
            // user has token already, and repo should only be stored if user has permission on it
            return {
                verdict: 'previously_authorized',
                payload: [ // return iterable payload so I can spread it as function args
                    access_token,
                    target_repo // re-check permissions below
                ]
            }
        } else if (access_token) {
            // this case should only occure on returning to page within same browser sesh
            // user has token already, but needs to connect a repo
            return {
                verdict: 'previously_authenticated',
                payload: access_token
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
        else if (verdict === 'previously_authorized') {
            // previously authorized, try to authorize again
            this.props.setAuthToken(payload[0])
            this.props.fetchUserPermission(...payload)
        } else if (verdict === 'previously_authenticated') {
            // previously auathenticated, no need to authorize again
            // we need to collect a new repo from user
            this.props.setAuthToken(payload)
        } else if (verdict === 'pending') {
            window.history.replaceState('publiccode-pusher login', '', window.location.pathname)
            window.sessionStorage.removeItem('GH_STATE_TOKEN')
            this.props.exchangeCodeForToken(payload)
        } else {
            const ghStateToken = Gh.generateState()
            window.sessionStorage.setItem('GH_STATE_TOKEN', ghStateToken)
            this.props.setStateToken(ghStateToken)
        }
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

    componentDidUpdate(prevProps) {
        let { verdict, payload } = this.checkAuthState()
        if (!(verdict === 'authenticated' && this.props.authorized)
        || this.props.targetRepo !== prevProps.targetRepo) {
            this.handleAuthState({ verdict, payload })
        }
    }

    render() {
        return (
            this.props.authenticateFetching || this.props.authorizeFetching
            ? <LoadScreen />
            : this.props.authorized === 'authorized'
                ? <Editor/>
                : <Login/>
        )
    }
}

export default Index
