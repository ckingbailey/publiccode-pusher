import { createAction, handleActions } from "redux-actions"

const initialState = {
    isFetching: false,
    masterSHA: null,
    newBranchSHA: null,
    error: null
}

export const startFetch = createAction('START_FETCH')
export const endFetch = createAction('END_FETCH')
export const setNewBranchSHA = createAction('SET_NEW_BRANCH_SHA')

const reducer = handleActions({
    [ startFetch ]: state => ({
        ...state,
        isFetching: true
    }),
    [ endFetch ]: state => ({
        ...state,
        isFetching: false
    })
}, initialState)

export default reducer
