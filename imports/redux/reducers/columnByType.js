import { assign } from 'lodash';
import { CREATE_STICKY } from '../actions/sticky';

const column = (state = [], action) => {
  switch (action.type) {
    case CREATE_STICKY:
      return state.concat(action.sticky);
    default:
      return state;
  }
};

const columnByType = (state = {}, action) => {
  switch (action.type) {
    case CREATE_STICKY:
      return assign({}, state, {
        [action.sticky.type]: column(state[action.sticky.type], action),
      });
    default:
      return state;
  }
};

export default columnByType;
