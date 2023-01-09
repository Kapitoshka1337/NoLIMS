import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import auth from './reducers/auth';
import common from './reducers/common';
import Location from './reducers/location';
import Equipment from './reducers/equipment';
import Department from './reducers/department';
import Manufacturer from './reducers/manufacturer';
import Checks from './reducers/checks';
import DocumentKind from './reducers/documentKind';
import User from './reducers/user';
import Role from './reducers/roles';
import Instruction from './reducers/instructions';

export default (history) => combineReducers({
  auth,
  common,
  Location,
  Equipment,
  Department,
  Manufacturer,
  Checks,
  DocumentKind,
  User,
  Role,
  Instruction,
  router: connectRouter(history)
});
