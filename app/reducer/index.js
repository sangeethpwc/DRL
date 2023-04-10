import authReducer from '../slices/authenticationSlice';
import homeReducer from '../slices/homesSlices';
import productReducer from '../slices/productSlices';
import profileReducer from '../slices/profileSlices';
import {combineReducers} from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  authenticatedUser: authReducer,
  home: homeReducer,
  product: productReducer,
  profile: profileReducer,
});

export default rootReducer;
