import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";

import LoginForm from './LoginForm'

let mapStateToProps = state => ({
    ghStateToken: state.auth.ghStateToken,
    authError: state.auth.error,
    authFetching: state.auth.isFetching,
    authorized: state.auth.authorized
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

        let unauthorized = this.props.authorized === 'unauthorized' && (
            <div style={{
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
                <p>Talk to a project admin to get your permissions elevated</p>
            </div>
        )

        return (
            <Fragment>
                { errorMessage }
                { unauthorized }
                <div style={{ display: 'flex', width: '100vw', flexFlow: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ marginBottom: '4rem', paddingTop: '2rem' }}>
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