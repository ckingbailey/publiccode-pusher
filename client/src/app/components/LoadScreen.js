import React from 'react'

const LoadScreen = () => (
    <div>
        <div className='spinner-container'>
            <i className='loading-spinner'></i>
        </div>
        <span>{this.props.authFetching && 'Authorizing on Github'}</span>
    </div>
)

export default LoadScreen
