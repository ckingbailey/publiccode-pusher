import { createAction, handleActions } from "redux-actions"

const initialState = {
    isFetching: false,
    masterSHA: null,
    newBranchSHA: null,
    error: null
}

export const startFetch = createAction('START_FETCH')
const setMasterBranchSHA = createAction('SET_MASTER_BRANCH_SHA')
export const setNewBranchSHA = createAction('SET_NEW_BRANCH_SHA')

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
    ),
    [ setNewBranchSHA ]: (state, action) => (
        action.error
        ? {
            ...state,
            isFetching: false,
            error: action.payload.message
        }
        : {
            ...state,
            isFetching: false,
            newBranchSHA: action.payload,
            error: null
        }
    )
}, initialState)

export default reducer
