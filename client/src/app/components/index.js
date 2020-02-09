import React, { Component } from "react"
import { connect } from "react-redux";

import Editor from './editor'
import Login from './Login'

const mapStateToProps = state => ({
    ghAuthToken: state.auth.ghAuthToken
})

@connect (
    mapStateToProps
)
class Index extends Component {
    render() {
        return (
            this.props.ghAuthToken
            ? <Editor/>
            : <Login/>
        )
    }
}

export default Index
