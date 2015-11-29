import * as types from '../constants/ActionTypes';
import interpret from '../interpret';
import * as deBruijnIndex from '../plugins/de-bruijn-index';

function delay(o) {
  return new Promise(resolve => window.requestAnimationFrame(() => resolve(o)));
}

export function source(value) {
  return {
    type: types.LAMBDA_SOURCE,
    text: value
  }
}

export function input(value) {
  return {
    type: types.LAMBDA_INPUT,
    text: value
  }
}

export function execute() {
  return {
    type: types.LAMBDA_EXECUTE
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
      },
      dispatch
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
