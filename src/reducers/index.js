import { combineReducers } from 'redux';
import auth from './auth';
import classify from './classify';

export default combineReducers({
  auth,
  classify,
});