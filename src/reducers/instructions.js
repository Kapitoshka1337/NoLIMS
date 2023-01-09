import {
  INSTRUCTION_CARD_LOADED,
  INSTRUCTION_CARD_UNLOADED,
  INSTRUCTION_CARD_CHANGED,
  INSTRUCTION_CARD_INITFORM
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case INSTRUCTION_CARD_LOADED:
      return {
        ...state,
        isLoad: action.payload.isLoad,
        isChanged: action.payload.isChanged,
        isInitForm: action.payload.isInitForm
      };
    case INSTRUCTION_CARD_UNLOADED:
      return {
        ...state,
        isLoad: action.payload.isLoad,
        isChanged: action.payload.isChanged,
        isInitForm: action.payload.isInitForm
      };
    case INSTRUCTION_CARD_CHANGED:
      return {
        ...state,
        isChanged: action.payload.isChanged,
        chagnedObject: action.payload.chagnedObject
      };
    case INSTRUCTION_CARD_INITFORM:
      return {
        ...state,
        isInitForm: action.payload.isInitForm
      };
    default:
      return state;
  }
};
