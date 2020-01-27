import { createStore, combineReducers, compose, applyMiddleware } from "redux"
import { reducer as formReducer } from "redux-form"
import thunk from 'redux-thunk'
import notifications from "./notifications"
import infobox from "./infobox"
import auth from './auth'

const rootReducer = combineReducers({
  form: formReducer,
  notifications: notifications,
  infobox: infobox,
  auth
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
)
export default store
