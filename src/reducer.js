import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import auth from './reducers/auth';
import common from './reducers/common';
import Location from './reducers/location';
import Equipment from './reducers/equipment';
import Department from './reducers/department';

export default (history) => combineReducers({
  auth,
  common,
  Location,
  Equipment,
  Department,
  router: connectRouter(history)
});
