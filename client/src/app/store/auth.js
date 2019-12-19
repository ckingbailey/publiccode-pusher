import { createAction, handleActions } from "redux-actions"

export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN'
export const SET_STATE_TOKEN = 'SET_STATE_TOKEN'
export const SET_GH_CODE = 'SET_GH_CODE'
export const LOGOUT = 'LOGOUT'

export const authorize = createAction(SET_AUTH_TOKEN)
export const setStateToken = createAction(SET_STATE_TOKEN)
export const setGHCode = createAction(SET_GH_CODE)
export const logout = createAction(LOGOUT)

const initialState = {
    ghAuthToken: null,
    ghStateToken: null,
    ghCode: null
}

const reducer = handleActions(
    {
        SET_AUTH_TOKEN: (state, action) => {
            return {
                ...state,
                ghAuthToken: action.payload
            }
        },
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
    },
    initialState
)

export default reducer
