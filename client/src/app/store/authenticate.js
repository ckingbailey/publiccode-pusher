import { createAction, handleActions } from "redux-actions"
import Gh from '../utils/GithubClient' // TODO: use Gh client to handle authentication
import { fetchUserPermission } from './authorize'

export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN'
export const SET_GH_CODE = 'SET_GH_CODE'
export const LOGOUT = 'LOGOUT'

const getAuthToken = createAction('GET_AUTH_TOKEN')
export const setAuthToken = createAction('SET_AUTH_TOKEN')
export const setStateToken = createAction('SET_STATE_TOKEN')
export const setGHCode = createAction(SET_GH_CODE)
export const logout = createAction(LOGOUT)

const initialState = {
    isFetching: false,
    error: null,
    authenticated: false,
    ghAuthToken: null,
    ghStateToken: null,
    ghCode: null
}

/**
 * This action creator takes the code returned from github.com/authorize
 * and exchanges it for a GitHub auth token
 */
export function exchangeCodeForToken(code) {
    // fetch ghAuthToken from endpoint appropriate to environment
    return async function(dispatch) {
        dispatch(getAuthToken())

        let gh = new Gh()
        try {
            let { access_token } = await gh.get('token', { code })

            if (!access_token) throw new Error('No access token on response')

            dispatch(setAuthToken(access_token))
            window.sessionStorage.setItem('GH_ACCESS_TOKEN', access_token)

            let target_repo = window.sessionStorage.getItem('target_repo')
            dispatch(fetchUserPermission(access_token, target_repo))
        } catch (er) {
            console.error(er)
            dispatch(setAuthToken(er))
        }
    }
}

const reducer = handleActions({
    [ getAuthToken ]: state => ({
        ...state,
        isFetching: true,
    }),
    [ setAuthToken ]: (state, action) => {
        return (
        action.error
        ? {
            ...state,
            authenticated: false,
            ghAuthToken: null,
            isFetching: false,
            error: action.payload.message
        }
        : {
            ...state,
            authenticated: true,
            ghAuthToken: action.payload,
            isFetching: false,
            error: null
        }
    )},
    [ setStateToken ]: (state, action) => {
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
