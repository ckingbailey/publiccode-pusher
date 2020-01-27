import React, { Component } from 'react'
import { connect } from "react-redux";

import { setStateToken, setAuthToken, exchangeStateAndCodeForToken } from '../store/auth'

import Gh from '../utils/GithubClient'

let mapStateToProps = state => ({
    ghAuthToken: state.auth.ghAuthToken
})

let mapDispatchToProps = dispatch => ({
    setAuthToken: token => dispatch(setAuthToken(token)),
    exchangeStateAndCodeForToken: (stateToken, code) => dispatch(exchangeStateAndCodeForToken(stateToken, code)),
    setStateToken: stateToken => dispatch(setStateToken(stateToken))
})

// @connect(
//     mapStateToProps,
//     mapDispatchToProps
// )
class Login extends Component {
    constructor() {
        super()
        this.state = {
            ghStateToken: null
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

    storeTokenLocally(token) {
        if (token) {
            localStorage.setItem('ghAuthToken', token)
            console.log(`done stored token ${token}`)
        }
    }

    /**
     * When component mounts,
     *   1. check for GH auth token on localStorage
     *      - if present, user is authorized
     *   2. if no GH auth token, check for [ GH state token, code ] in `qs` & [ GH state token ] in `localStorage`
     *      - if found, user is mid-auth-flow, exchange GH code for auth token
     *   3. if no [ GH state token | code ] on `qs` or no [ GH state token ] in `localStorage`, user has yet to authorize
     *      - generate Gh state token, hold it in state & save it in localStorage
     */
    componentDidMount() {
        console.log('Login done mounted')
        // if ghAuthToken is on localStorage and not Redux, this must be first load
        let storedToken = window.localStorage.getItem('ghAuthToken')
        console.log(`is storedToken truthy? ${Boolean(storedToken)}`)
        if (storedToken || this.props.ghAuthToken !== null) {
            console.log(`is token on localStorage? ${storedToken}`)
            console.log(`is token on store.state? ${this.props.ghAuthToken}`)
            if (storedToken && this.props.ghAuthToken === null) {
                console.log('stored token but no token on store. Call setAuthToken')
                this.props.setAuthToken(window.localStorage.getItem('ghAuthToken'))
            }
            // if ghAuthToken is on Redux but not on localStorage, we gotta store it on localStorage
            else if (!storedToken && this.props.ghAuthToken !== null) {
                console.log(`token not stored ${storedToken}, but on redux store ${this.props.ghAuthToken}. Store it`)
                this.storeTokenLocally(this.props.ghAuthToken)
            }
            return
        }
        console.log('No auth token found')

        // if no ghAuthToken found anywhere, check for gh state token & code
        let { code, stateToken } = this.getCodeAndStateFromQs(window.location.search)
        console.log(`got state and code from qs ${code}, ${stateToken}`)
        let storedStateToken = window.localStorage.getItem('GH_STATE_TOKEN')
        console.log(`got locally stored state token ${storedStateToken}`)
        // if we have code & state tokens match in qs & localStorage
        // use them to fetch ghAuthToken
        console.log(`stored state token equals received state token ${stateToken === storedStateToken}`)
        if (code && stateToken && storedStateToken && stateToken === storedStateToken) {
            console.log('Found state token and code. Call exchangeStateAndCode')
            this.props.exchangeStateAndCodeForToken(stateToken, code)
        } else {
            let ghStateToken = Gh.generateState()
            localStorage.setItem('GH_STATE_TOKEN', ghStateToken)
            this.setState({ ghStateToken })
        }
    }

    render() {
        let qs = `client_id=8390933a81635970d3b6&state=${this.state.ghStateToken}&scope=public_repo%20read:user`

        return (
            <div>
                <a
                    href={ `https://github.com/login/oauth/authorize?${qs}` }
                    className="editor_button editor_button--primary"
                >Login to GitHub</a>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)