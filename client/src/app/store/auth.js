import { createAction, handleActions } from "redux-actions"
import GithubClient from '../utils/GithubClient'

export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN'
export const SET_STATE_TOKEN = 'SET_STATE_TOKEN'
export const SET_GH_CODE = 'SET_GH_CODE'
export const LOGOUT = 'LOGOUT'

const getAuthToken = createAction('GET_AUTH_TOKEN')
export const setAuthToken = createAction('SET_AUTH_TOKEN')
export const setStateToken = createAction(SET_STATE_TOKEN)
export const setGHCode = createAction(SET_GH_CODE)
export const logout = createAction(LOGOUT)

export function exchangeStateAndCodeForToken(stateToken, code) {
    console.log(`exchangeStateAndCode invoked with ${stateToken}, ${code}`)
    // fetch ghAuthToken from endpoint appropriate to environment
    let gh = new GithubClient()

    return function(dispatch) {
        console.log('dispatch getAuthToken()')
        dispatch(getAuthToken())

        console.log('fetch token')
        gh.get('token', {
            code,
            stateToken
        }).then(token => {
            console.log(`done fetched token ${token}`)
            window.localStorage.setItem('ghAuthToken', token)
            dispatch(setAuthToken(token))
        }).catch(er => {
            console.error(er)
            dispatch(setAuthToken(er))
        })
    }
}

const initialState = {
    isFetching: false,
    error: null,
    ghAuthToken: null,
    ghStateToken: null,
    ghCode: null
}

const reducer = handleActions({
    [ getAuthToken ]: (state) => {
        console.log('invoked getAuthToken reducer')
        return ({
        ...state,
        isFetching: true,
    })},
    [ setAuthToken ]: (state, action) => {
        console.log(`invoked setAuthToken reducer with ${JSON.stringify(action)}`)
        return (
        action.error
        ? {
            ...state,
            ghAuthToken: null,
            isFetching: false,
            error: action.payload
        }
        : {
            ...state,
            ghAuthToken: action.payload,
            isFetching: false,
            error: null
        }
    )},
    SET_STATE_TOKEN: (state, action) => {
        return {
            ...state,
            ghStateToken: action.payload
        }
    },
    SET_GH_CODE: (state, action) => {
        return {
            ...state,
            ghCode: action.payload
        }
    },
    LOGOUT: () => initialState
}, initialState)

export default reducer
