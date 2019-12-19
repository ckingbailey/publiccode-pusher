import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import { authorize } from '../store/auth'

import Editor from './editor'
import Login from './Login'
// import Login from './login'

const mapStateToProps = state => {
    return { auth: state.auth }
};

const mapDispatchToProps = dispatch => {
    return {
        authorize: token => dispatch(authorize(token)),
    };
};

@connect(
    mapStateToProps,
    mapDispatchToProps
)
export default class Index extends Component {
    // get auth state from this.props.authorize()
    checkAuthState() {
        // check state
        // if not in state, check localStorage
    }

    conditionallyRenderEditorOrLogin() {
        if (this.props.auth.ghStateToken) {
            return <Editor />
        } else return <Login />
    }

    render() {
        // conditionally render Editor or Login
        return (
            this.conditionallyRenderEditorOrLogin()
        )
    }
}