import { createAction, handleActions } from "redux-actions"
import Gh from '../utils/GithubClient'
import { getRepoFromBrowserStorage } from '../utils/browserStorage'

const getPermission = createAction('GET_PERMISSION')
const setAuthorize = createAction('SET_AUTHORIZE')

const initialState = {
    isFetching: false,
    error: null,
    authorized: '',
}

/**
 * Not an action creator
 * This function grabs the target_repo from sessionStorage
 */
export const fetchUserPermissionFromBrowserStorage = token => async dispatch => {
    let { owner, repo } = getRepoFromBrowserStorage()
    dispatch(fetchUserPermission(token, owner, repo))
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
        } else {
            dispatch(setAuthorize('unauthorized'))
            window.sessionStorage.removeItem('target_repo')
        }
    } catch (er) {
        if (er.code === 403) {
            dispatch(setAuthorize('unauthorized'))
            window.sessionStorage.removeItem('target_repo')
        } else {
            // QUESTION: what kinds of errors might occur here
            // that might make us want to remove target_repo from browser storage?
            console.error(er)
            dispatch(setAuthorize(er))
        }
    }
}

const reducer = handleActions({
    [ getPermission ]: state => ({
        ...state,
        isFetching: true
    }),
    [ setAuthorize ]: (state, action) => (
        action.error
        ? {
            ...state,
            authorized: '',
            isFetching: false,
            error: action.payload.message // NOTE: The payload here is an Error instance
        }
        : {
            ...state,
            authorized: action.payload,
            error: null
        }
    )
}, initialState)

export default reducer
