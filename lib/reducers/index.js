import {
  LAMBDA_SOURCE,
  LAMBDA_INPUT_REGISTER, LAMBDA_INPUT, LAMBDA_INPUT_SUBMIT,
  LAMBDA_EXECUTE,
  LAMBDA_REDUCE_REQUEST, LAMBDA_REDUCE_SUCCESS, LAMBDA_REDUCE_FAILURE,
  LAMBDA_REDUCE_STEP
} from '../constants/ActionTypes';
import * as LambdaActions from '../actions/lambda';
import parse from '../parse';

let source = `(\\true
(\\false
  bind getChar putChar
)(\\a \\b b)
)(\\a \\b a)`;

const initialState = {
  lambda: {
    source: source,
    resolve: null,
    input: '',
    queue: [],
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
          resolve: state.lambda.resolve,
          input: state.lambda.input,
          queue: state.lambda.queue,
          history: state.lambda.history,
          ast: parse(action.text),
          reduced: []
        }
      };
    case LAMBDA_INPUT_REGISTER: {
      let [c, ...queue] = state.lambda.queue;
      if (c) {
        action.resolve(c);
        action.resolve = null;
      }
      return {
        lambda: {
          source: state.lambda.source,
          resolve: action.resolve,
          input: state.lambda.text,
          queue: queue,
          history: state.lambda.history,
          ast: state.lambda.ast,
          reduced: state.lambda.reduced
        }
      };
    }
    case LAMBDA_INPUT:
      return {
        lambda: {
          source: state.lambda.source,
          resolve: state.lambda.resolve,
          input: action.text,
          queue: state.lambda.queue,
          history: state.lambda.history,
          ast: state.lambda.ast,
          reduced: state.lambda.reduced
        }
      };
    case LAMBDA_EXECUTE: {
      let queue = Array.prototype.slice.call(state.lambda.input);
      queue.push('\n');
      queue = [...state.lambda.queue, ...queue];

      let { resolve } = state.lambda;
      let [c, ...cs] = queue;
      if (resolve) {
        resolve(c);
        resolve = null;
        queue = cs;
      }

      return {
        lambda: {
          source: state.lambda.source,
          resolve: resolve,
          input: '',
          queue: queue,
          history: [...state.lambda.history, state.lambda.input],
          ast: state.lambda.ast,
          reduced: state.lambda.reduced
        }
      };
    }
    case LAMBDA_REDUCE_REQUEST:
      return {
        lambda: {
          source: state.lambda.source,
          resolve: state.lambda.resolve,
          input: state.lambda.input,
          queue: state.lambda.queue,
          history: state.lambda.history,
          ast: state.lambda.ast,
          reduced: []
        }
      };
    case LAMBDA_REDUCE_STEP:
      return {
        lambda: {
          source: state.lambda.source,
          resolve: state.lambda.resolve,
          input: state.lambda.input,
          queue: state.lambda.queue,
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
