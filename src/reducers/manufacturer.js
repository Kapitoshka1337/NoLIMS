import {
  MANUFACTURER_CARD_LOADED,
  MANUFACTURER_CARD_UNLOADED,
  MANUFACTURER_CARD_CHANGED,
  MANUFACTURER_CARD_INITFORM
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case MANUFACTURER_CARD_LOADED:
      return {
        ...state,
        isLoad: action.payload.isLoad,
        isChanged: action.payload.isChanged,
        isInitForm: action.payload.isInitForm
      };
    case MANUFACTURER_CARD_UNLOADED:
      return {
        ...state,
        isLoad: action.payload.isLoad,
        isChanged: action.payload.isChanged,
        isInitForm: action.payload.isInitForm
      };
    case MANUFACTURER_CARD_CHANGED:
      return {
        ...state,
        isChanged: action.payload.isChanged,
        chagnedObject: action.payload.chagnedObject
      };
    case MANUFACTURER_CARD_INITFORM:
      return {
        ...state,
        isInitForm: action.payload.isInitForm
      };
    default:
      return state;
  }
};
