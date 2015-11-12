import * as types from '../constants/ActionTypes';
import interpret from '../interpret';
import * as deBruijnIndex from '../plugins/de-bruijn-index';

function delay(o) {
  return new Promise(resolve => setTimeout(() => resolve(o), 250));
}

export function source(value) {
  return {
    type: types.LAMBDA_SOURCE,
    text: value
  }
}

export function reduce(node) {
  return dispatch => {
    dispatch({
      type: types.LAMBDA_REDUCE_REQUEST
    });
    interpret(
      node,
      deBruijnIndex.subs,
      deBruijnIndex.annotate,
      node => {
        dispatch(step(node));
        return delay(node);
      }
    )
      .then(node => dispatch(didReduce(node)))
      .catch(error => dispatch(reduceFailed(error)));
  }
}

export function step(node) {
  return {
    type: types.LAMBDA_REDUCE_STEP,
    node: node
  }
}

export function didReduce(node) {
  return {
    type: types.LAMBDA_REDUCE_SUCCESS,
    node: node
  }
}

export function reduceFailed(error) {
  return {
    type: types.LAMBDA_REDUCE_FAILURE,
    error: error
  }
}
