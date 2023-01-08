import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import auth from './reducers/auth';
import common from './reducers/common';
import LocationCard from './reducers/locationCard';

export default (history) => combineReducers({
  auth,
  common,
  LocationCard,
  router: connectRouter(history)
});
