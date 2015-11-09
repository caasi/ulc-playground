import { FOOBAR } from '../constants/ActionTypes';

const initialState = {
  foobar: false
};

export default function index(state = initialState, action) {
  switch(action.type) {
    case FOOBAR:
      return { foobar: !state.foobar };
      break;
    default:
      return state;
  }
};
