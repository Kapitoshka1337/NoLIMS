import {
  EQUIPMENT_VIEW_PAGE_LOADED
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case EQUIPMENT_VIEW_PAGE_LOADED:
      return {
        ...state,
        data: action.payload.data
      };
    default:
      return state;
  }
};
