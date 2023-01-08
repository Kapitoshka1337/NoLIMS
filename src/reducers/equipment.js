import {
  EQUIPMENT_CARD_LOADED,
  EQUIPMENT_CARD_UNLOADED,
  EQUIPMENT_CARD_CHANGED,
  EQUIPMENT_CARD_INITFORM
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case EQUIPMENT_CARD_LOADED:
      return {
        ...state,
        isLoad: action.payload.isLoad,
        isChanged: action.payload.isChanged,
        isInitForm: action.payload.isInitForm
      };
    case EQUIPMENT_CARD_UNLOADED:
      return {
        ...state,
        isLoad: action.payload.isLoad,
        isChanged: action.payload.isChanged,
        isInitForm: action.payload.isInitForm
      };
    case EQUIPMENT_CARD_CHANGED:
      return {
        ...state,
        isChanged: action.payload.isChanged,
        chagnedObject: action.payload.chagnedObject
      };
    case EQUIPMENT_CARD_INITFORM:
      return {
        ...state,
        isInitForm: action.payload.isInitForm
      };
    default:
      return state;
  }
};
