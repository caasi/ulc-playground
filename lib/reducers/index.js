import {
  LAMBDA_SOURCE,
  LAMBDA_REDUCE_REQUEST, LAMBDA_REDUCE_SUCCESS, LAMBDA_REDUCE_FAILURE,
  LAMBDA_REDUCE_STEP
} from '../constants/ActionTypes';
import * as LambdaActions from '../actions/lambda';
import parse from '../parse';

let source = `(\\true
  print this is true
)(\\a \\b a)`;

const initialState = {
  lambda: {
    source: source,
    ast: parse(source),
    reduced: []
  }
};

export default function index(state = initialState, action) {
  switch(action.type) {
    case LAMBDA_SOURCE:
      return {
        lambda: {
          source: action.text,
          ast: parse(action.text),
          reduced: []
        }
      };
    case LAMBDA_REDUCE_REQUEST:
      return {
        lambda: {
          source: state.lambda.source,
          ast: state.lambda.ast,
          reduced: []
        }
      }
    case LAMBDA_REDUCE_STEP:
      return {
        lambda: {
          source: state.lambda.source,
          ast: state.lambda.ast,
          reduced: [...state.lambda.reduced, action.node]
        }
      }
    default:
      return state;
  }
};
