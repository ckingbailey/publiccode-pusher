import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";

import { setStateToken, setAuthToken, exchangeStateAndCodeForToken } from '../store/auth'

import Gh from '../utils/GithubClient'

let mapStateToProps = state => ({
    ghStateToken: state.auth.ghStateToken,
    authError: state.auth.error
})

@connect(
    mapStateToProps
)
class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            targetRepo: ''
        }
    }

    handleTextInput(ev) { this.setState({ targetRepo: ev.target.value }) }

    render() {
        let qs = `client_id=8390933a81635970d3b6&state=${this.props.ghStateToken}&scope=public_repo%20read:user`
        let errorMessage = this.props.authError && (
            <div style={{
                backgroundColor: '#e80801',
                width: '100%',
                position: 'absolute',
                padding: '.25rem',
                color: 'white',
                textAlign: 'center'
            }}>
                <h1 className="notify-title">There was a problem signing into GitHub</h1>
                <p>{ this.props.authError }</p>
            </div>
        )

        return (
            <Fragment>
                { errorMessage }
                <div style={{ display: 'flex', width: '100vw', flexFlow: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <label htmlFor="target-repo">Enter the full URL of the GitHub repo you want to add a publiccode.yml file to</label>
                        <aside>Enter the complete URL of the repo, starting with &ldquo;https://&rdquo;</aside>
                        <input
                            id="target-repo"
                            type="text"
                            placeholder="https://github.com/repo-owner/repo-name"
                            value={ this.state.targetRepo }
                            onChange={ ev => this.handleTextInput(ev) }
                        />
                        <a
                            href={ `https://github.com/login/oauth/authorize?${qs}` }
                            onClick={ () => sessionStorage.setItem('TARGET_REPO', this.state.targetRepo) }
                            className="editor_button editor_button--primary"
                        >Login to GitHub</a>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Login