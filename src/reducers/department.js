import {
  DEPARTMENT_CARD_LOADED,
  DEPARTMENT_CARD_UNLOADED,
  DEPARTMENT_CARD_CHANGED,
  DEPARTMENT_CARD_INITFORM
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case DEPARTMENT_CARD_LOADED:
      return {
        ...state,
        isLoad: action.payload.isLoad,
        isChanged: action.payload.isChanged,
        isInitForm: action.payload.isInitForm
      };
    case DEPARTMENT_CARD_UNLOADED:
      return {
        ...state,
        isLoad: action.payload.isLoad,
        isChanged: action.payload.isChanged,
        isInitForm: action.payload.isInitForm
      };
    case DEPARTMENT_CARD_CHANGED:
      return {
        ...state,
        isChanged: action.payload.isChanged,
        chagnedObject: action.payload.chagnedObject
      };
    case DEPARTMENT_CARD_INITFORM:
      return {
        ...state,
        isInitForm: action.payload.isInitForm
      };
    default:
      return state;
  }
};
