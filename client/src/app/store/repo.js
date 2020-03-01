import { createAction, handleActions } from "redux-actions"
import Gh from '../utils/GithubClient'

const initialState = {
    isFetching: false,
    masterSHA: null,
    error: null
}

const startFetch = createAction('START_FETCH')
const setMasterBranchSHA = createAction('SET_MASTER_BRANCH_SHA')

export const getMasterBranchSHA = (token, url) => async dispatch => {
    let gh = new Gh(token)
    try {
        let [ owner, repo ] = url.replace(/https*:\/\/github.com\//, '').split('/')

        let { object: branch } = await gh.repo.branch.get(owner, repo, 'master')
        console.log(branch)

        dispatch(setMasterBranchSHA(branch.sha))
    } catch(er) {
        dispatch(setMasterBranchSHA(er))
    }
}

const reducer = handleActions({
    [ startFetch ]: state => ({
        ...state,
        isFetching: true
    }),
    [ setMasterBranchSHA ]: (state, action) => (
        action.error
        ? {
            ...state,
            isFetching: false,
            error: action.payload.message
        }
        : {
            ...state,
            isFetching: false,
            masterSHA: action.payload,
            error: null
        }
    )
}, initialState)

export default reducer
