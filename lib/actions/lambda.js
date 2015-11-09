import * as types from '../constants/ActionTypes';

export function source (value) {
  return {
    type: types.LAMBDA_SOURCE,
    text: value
  }
}
