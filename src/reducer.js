import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
// import article from './reducers/article';
// import articleList from './reducers/articleList';
import auth from './reducers/auth';
import common from './reducers/common';
// import editor from './reducers/editor';
// import home from './reducers/home';
// import profile from './reducers/profile';
// import settings from './reducers/settings';
import EquipmentView from './reducers/equipmentView';


export default (history) => combineReducers({
  auth,
  common,
  EquipmentView,
  router: connectRouter(history)
});