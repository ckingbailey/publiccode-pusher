import { createStore, combineReducers } from "redux"
import { reducer as formReducer } from "redux-form"
import notifications from "./notifications"
import infobox from "./infobox"
import auth from './auth'

const reducer = combineReducers({
  form: formReducer,
  notifications: notifications,
  infobox: infobox,
  auth
  // cache: cache,
  // data: data
})

const store = (window.devToolsExtension
  ? window.devToolsExtension()(createStore)
  : createStore)(reducer);

export default store
