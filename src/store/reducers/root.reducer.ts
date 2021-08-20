import { combineReducers } from 'redux';
import authReducer from './auth.reducer';
import meetingReducer from './meeting.reducer';
import utilReducer from './util.reducer';
import zoneReducer from './zone.reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  zone: zoneReducer,
  meeting: meetingReducer,
  util: utilReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
