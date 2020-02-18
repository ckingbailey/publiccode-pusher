import { createAction, handleActions } from "redux-actions"
import Gh from '../utils/GithubClient'

export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN'
export const SET_GH_CODE = 'SET_GH_CODE'
export const LOGOUT = 'LOGOUT'

const getAuthToken = createAction('GET_AUTH_TOKEN')
const getPermission = createAction('GET_PERMISSION')
export const setAuthToken = createAction('SET_AUTH_TOKEN')
const setAuthorize = createAction('SET_AUTHORIZE')
export const setStateToken = createAction('SET_STATE_TOKEN')
export const setGHCode = createAction(SET_GH_CODE)
export const logout = createAction(LOGOUT)

const initialState = {
    isFetching: false,
    error: null,
    authenticated: false,
    authorized: '',
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
    return function(dispatch) {
        const TOKEN_SERVER = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000'
        : 'https://us-central1-github-commit-schema.cloudfunctions.net'

        dispatch(getAuthToken())

        fetch(`${TOKEN_SERVER}/token`, {
            mode: 'cors',
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            body: `code=${code}`
        }).then(res => {
            if (!res.ok) {
                let bodyMethod = res.headers.get('content-type').includes('application/json')
                ? 'json'
                : 'text'
                // TODO: get at response body here, and add it to Error on a prop that will not be dropped by createAction
                return res[bodyMethod]().then(body => {
                    let errorMsg = body.message || `${res.status} ${res.statusText}`
                    throw new Error(errorMsg)
                }).catch(er => {
                    throw er
                })
            }
            return res.json()
        }).then(body => {
            if (body.access_token) {
                dispatch(setAuthToken(body.access_token))
            } else {
                throw new Error('No access token on response')
            }
        }).catch(er => {
            console.error(er)
            dispatch(setAuthToken(er))
        })
    }
}

export const fetchUserPermission = (token, owner, repo) => async function(dispatch) {
    dispatch(getPermission())

    let permissible = [ 'write', 'maintain', 'admin' ]
    let gh = new Gh(token)

    try {
        let { login } = await gh.get('user')
        let { permission } = await gh.get('permission', { owner, repo, user: login })
        
        if (permissible.includes(permission)) {
            dispatch(setAuthorize('authorized'))
        } else dispatch(setAuthorize('unauthorized'))
    } catch (er) {
        console.error(er)
        dispatch(setAuthorize(er))
    }

}

const reducer = handleActions({
    [ getAuthToken ]: state => {
        return ({
        ...state,
        isFetching: true,
    })},
    [ getPermission ]: state => ({
        ...state,
        isFetching: true
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
    [ setAuthorize ]: (state, action) => (
        action.error
        ? {
            ...state,
            authorized: '',
            isFetching: false,
            error: action.payload.message
        }
        : {
            ...state,
            authorized: action.payload,
            error: null
        }
    ),
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
