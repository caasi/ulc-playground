import { LAMBDA_SOURCE } from '../constants/ActionTypes';
import parse from '../parse';

const initialState = {
  lambda: {
    source: ''
  }
};

export default function index(state = initialState, action) {
  switch(action.type) {
    case LAMBDA_SOURCE:
      return {
        lambda: {
          source: action.text,
          ast: parse(action.text)
        }
      };
      break;
    default:
      return state;
  }
};
