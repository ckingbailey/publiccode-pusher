import { createAction, handleActions } from "redux-actions"

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
    // fetch ghAuthToken from endpoint appropriate to environment
    return function(dispatch) {
        const TOKEN_SERVER = 'http://localhost:5000/token'

        dispatch(getAuthToken())

        fetch(TOKEN_SERVER, {
            mode: 'cors',
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            body: `code=${code}&state=${stateToken}`
        }).then(res => {
            if (!res.ok) {
                let er = new Error(`${res.status} ${res.statusText}`)
                er.code = res.status
                throw er
            }
            return res.json()
        }).then(({ access_token }) => {
            if (access_token) {
                dispatch(setAuthToken(access_token))
                // TODO: it would be useful if this localStorage operation did not happen here in the action creator
                window.localStorage.setItem('GH_AUTH_TOKEN', access_token)
                window.localStorage.removeItem('GH_STATE_TOKEN')
            } else {
                throw new Error('No access token on response')
            }
        }).catch(er => {
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
        return ({
        ...state,
        isFetching: true,
    })},
    [ setAuthToken ]: (state, action) => {
        return (
        action.error
        ? {
            ...state,
            ghAuthToken: null,
            isFetching: false,
            error: 'fetch error'
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
