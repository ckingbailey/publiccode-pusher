import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";

import LoginForm from './LoginForm'
import RepoForm from './RepoForm'
import { fetchUserPermission } from '../store/authorize';

let mapStateToProps = state => ({
    ghAuthToken: state.authenticate.ghAuthToken,
    ghStateToken: state.authenticate.ghStateToken,
    authenticated: state.authenticate.authenticated,
    authorized: state.authorize.authorized
})

let mapDispatchToProps = dispatch => ({
    fetchUserPermission: (token, owner, repo) => dispatch(fetchUserPermission(token, owner, repo))
})

@connect(
    mapStateToProps,
    mapDispatchToProps
)
class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            targetRepo: ''
        }
    }

    handleTextInput(ev) { this.setState({ targetRepo: ev.target.value }) }

    handleSubmit(ev, repo) {
        ev.preventDefault()
        sessionStorage.setItem('target_repo', repo)
        this.props.fetchUserPermission(this.props.ghAuthToken, repo)
    }

    render() {
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

        let targetRepo = window.sessionStorage.getItem('target_repo')
        let unauthorized = this.props.authorized === 'unauthorized' && (
            <div style={{
                border: '1px solid #5a768a',
                backgroundColor: '#e8e8e8',
                width: '100%',
                position: 'absolute',
                top: '0',
                left: '0',
                padding: '.25rem',
                color: '#004080',
                textAlign: 'center'
            }}>
                <h3>Looks like you don&apos;t have sufficient permissions on the GitHub repository</h3>
                <p>Talk to a project collaborator to get your permissions changed for the repo {targetRepo}</p>
            </div>
        )

        return (
            <Fragment>
                { errorMessage /* TODO: These should both be global */ }
                { unauthorized }
                <div style={{ display: 'flex', paddingTop: '6rem', width: '100vw', flexFlow: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ marginBottom: '8rem' }}>
                        {
                            this.props.authenticated
                            ? (
                                <RepoForm
                                    targetRepo={ this.state.targetRepo }
                                    handleTextInput={ ev => this.handleTextInput(ev) }
                                    handleSubmit={ ev => this.handleSubmit(ev, this.state.targetRepo) }
                                />
                            ) : <LoginForm
                                targetRepo={ this.state.targetRepo }
                                handleTextInput={ ev => this.handleTextInput(ev) }
                                state={ this.props.ghStateToken }
                              />
                        }
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Login