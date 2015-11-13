import {
  LAMBDA_SOURCE, LAMBDA_INPUT, LAMBDA_EXECUTE,
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
    input: '',
    history: [],
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
          input: state.lambda.input,
          history: state.lambda.history,
          ast: parse(action.text),
          reduced: []
        }
      };
    case LAMBDA_INPUT:
      return {
        lambda: {
          source: state.lambda.source,
          input: action.text,
          history: state.lambda.history,
          ast: state.lambda.ast,
          reduced: state.lambda.reduced
        }
      };
    case LAMBDA_EXECUTE:
      return {
        lambda: {
          source: state.lambda.source,
          input: '',
          history: [...state.lambda.history, state.lambda.input],
          ast: state.lambda.ast,
          reduced: state.lambda.reduced
        }
      };
    case LAMBDA_REDUCE_REQUEST:
      return {
        lambda: {
          source: state.lambda.source,
          input: state.lambda.input,
          history: state.lambda.history,
          ast: state.lambda.ast,
          reduced: []
        }
      };
    case LAMBDA_REDUCE_STEP:
      return {
        lambda: {
          source: state.lambda.source,
          input: state.lambda.input,
          history: state.lambda.history,
          ast: state.lambda.ast,
          reduced: action.node || state.lambda.reduced
        }
      };
    case LAMBDA_REDUCE_FAILURE:
      console.error(action.error);
      return state;
    default:
      return state;
  }
};
