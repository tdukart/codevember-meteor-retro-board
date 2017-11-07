import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import columnByType from './columnByType';

export default combineReducers({
  routerReducer,
  columnByType,
});
