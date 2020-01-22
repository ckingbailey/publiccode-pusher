import { createAction, handleActions } from "redux-actions"
import GithubClient from '../utils/GithubClient'

export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN'
export const SET_STATE_TOKEN = 'SET_STATE_TOKEN'
export const SET_GH_CODE = 'SET_GH_CODE'
export const LOGOUT = 'LOGOUT'

const getAuthToken = createAction('GET_AUTH_TOKEN', ({ token }) => token, ({ status }) => status)
export const setStateToken = createAction(SET_STATE_TOKEN)
export const setGHCode = createAction(SET_GH_CODE)
export const logout = createAction(LOGOUT)

export function exchangeStateAndCodeForToken(stateToken, code) {
    // fetch ghAuthToken from endpoint appropriate to environment
    let gh = new GithubClient()

    return function(dispatch) {
        dispatch(getAuthToken({ status: 'FETCHING'}))

        gh.get('token', {
            code,
            stateToken
        }).then(token => {
            window.localStorage.setItem('ghAuthToken', token)
            dispatch(getAuthToken({ token, status: 'SUCCESS' }))
        }).catch(er => {
            dispatch(getAuthToken({ er, status: 'FAILED' }))
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
    [ getAuthToken ]: (state, action) => ({
        ...state,
        ghAuthToken: action.payload.token,
        isFetching: action.meta.status === 'FETCHING',
        error: action.error
    }),
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
