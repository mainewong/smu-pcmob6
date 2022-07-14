import { combineReducers, createStore } from 'redux';
import accountPrefReducer from "./ducks/accountPref"
import blogAuthReducer from './ducks/blogAuth';
import uploadImgReducer from './ducks/uploadImg';

const reducer = combineReducers({
  auth: blogAuthReducer,
  accountPrefs: accountPrefReducer,
  image: uploadImgReducer,
});

const store = createStore(reducer);

export default store;
