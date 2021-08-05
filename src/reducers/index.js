import { combineReducers } from 'redux';
import auth from './auth';
import menu from './menu';
import classify from './classify';

export default combineReducers({
  auth,
  menu,
  classify,
});