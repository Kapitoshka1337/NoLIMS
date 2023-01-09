import {
  DOCUMENT_KIND_CARD_LOADED,
  DOCUMENT_KIND_CARD_UNLOADED,
  DOCUMENT_KIND_CARD_CHANGED,
  DOCUMENT_KIND_CARD_INITFORM
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case DOCUMENT_KIND_CARD_LOADED:
      return {
        ...state,
        isLoad: action.payload.isLoad,
        isChanged: action.payload.isChanged,
        isInitForm: action.payload.isInitForm
      };
    case DOCUMENT_KIND_CARD_UNLOADED:
      return {
        ...state,
        isLoad: action.payload.isLoad,
        isChanged: action.payload.isChanged,
        isInitForm: action.payload.isInitForm
      };
    case DOCUMENT_KIND_CARD_CHANGED:
      return {
        ...state,
        isChanged: action.payload.isChanged,
        chagnedObject: action.payload.chagnedObject
      };
    case DOCUMENT_KIND_CARD_INITFORM:
      return {
        ...state,
        isInitForm: action.payload.isInitForm
      };
    default:
      return state;
  }
};
