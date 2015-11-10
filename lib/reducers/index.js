import { LAMBDA_SOURCE, LAMBDA_REDUCE } from '../constants/ActionTypes';
import parse from '../parse';
import interpret from '../interpret';
import * as deBruijnIndex from '../plugins/de-bruijn-index';

const initialState = {
  lambda: {
    source: '',
    ast: null,
    reduced: null
  }
};

export default function index(state = initialState, action) {
  switch(action.type) {
    case LAMBDA_SOURCE:
      return {
        lambda: {
          source: action.text,
          ast: parse(action.text),
          reduced: null
        }
      };
      break;
    case LAMBDA_REDUCE:
      if (!state.lambda.ast) return state;
      return {
        lambda: {
          source: state.lambda.source,
          ast: state.lambda.ast,
          reduced: interpret(state.lambda.ast, deBruijnIndex.subs, deBruijnIndex.annotate)
        }
      }
    default:
      return state;
  }
};
