import { createStore, combineReducers, compose, applyMiddleware } from "redux"
import { reducer as formReducer } from "redux-form"
import thunk from 'redux-thunk'
import notifications from "./notifications"
import infobox from "./infobox"
import authenticate from './authenticate'
import authorize from './authorize'
import repo from './repo'

const rootReducer = combineReducers({
  form: formReducer,
  notifications: notifications,
  infobox: infobox,
  authenticate,
  authorize,
  repo
})

// TODO: only add DEVTOOLS_EXTENSION in development
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
)
export default store
