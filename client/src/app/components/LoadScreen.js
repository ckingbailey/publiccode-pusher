import React from 'react'

const LoadScreen = () => (
    <div className="load-screen__container">
        <div className='load-screen__spinner-container'>
            <i className='load-screen__spinner'></i>
        </div>
        <span>Authorizing on Github</span>
    </div>
)

export default LoadScreen
