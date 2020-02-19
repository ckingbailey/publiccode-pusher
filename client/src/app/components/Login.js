import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";

import LoginForm from './LoginForm'

let mapStateToProps = state => ({
    ghStateToken: state.authenticate.ghStateToken,
    authenticateError: state.authenticate.error,
    authenticateFetching: state.authenticate.isFetching,
    authorizeError: state.authorize.error,
    authorizeFetching: state.authorize.isFetching,
    authorized: state.authorize.authorized
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
                { errorMessage }
                { unauthorized }
                <div style={{ display: 'flex', paddingTop: '6rem', width: '100vw', flexFlow: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ marginBottom: '8rem' }}>
                        {
                            this.props.authFetching
                            ? (
                                <div>
                                    <div className='spinner-container'>
                                        <i className='loading-spinner'></i>
                                    </div>
                                    <span>{ this.props.authFetching && 'Authorizing on Github' }</span>
                                </div>
                            ) : <LoginForm
                                unauthorized={ Boolean(unauthorized) }
                                targetRepo={ this.state.targetRepo } 
                                handleTextInput={ ev => this.handleTextInput(ev) }
                                qs={ `client_id=8390933a81635970d3b6&state=${this.props.ghStateToken}&scope=public_repo%20read:user` }
                              />
                        }
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Login