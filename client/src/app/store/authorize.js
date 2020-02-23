import { createAction, handleActions } from "redux-actions"
import Gh from '../utils/GithubClient'

const getPermission = createAction('GET_PERMISSION')
const setAuthorize = createAction('SET_AUTHORIZE')

const initialState = {
    isFetching: false,
    error: null,
    authorized: '',
}

export const fetchUserPermission = (token, url) => async function(dispatch) {
    dispatch(getPermission())
    
    let permissible = [ 'write', 'maintain', 'admin' ]
    let gh = new Gh(token)
    
    try {
        let [ owner, repo ] = url.replace(/https*:\/\/github.com\//, '').split('/')

        if (!owner || !repo) throw Error(`${url} is not a valid GitHub repository URL`)

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
            // QUESTION: What kinds of errors might occur here
            // that might make us want to remove target_repo from browser storage?
            // QUESTION: What kinds of errors might occur here
            // that might make us want to set 'unauthorized'?
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
            isFetching: false,
            error: null
        }
    )
}, initialState)

export default reducer
