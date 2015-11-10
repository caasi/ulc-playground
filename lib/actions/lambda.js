import * as types from '../constants/ActionTypes';

export function source(value) {
  return {
    type: types.LAMBDA_SOURCE,
    text: value
  }
}

export function reduce() {
  return {
    type: types.LAMBDA_REDUCE
  }
}
