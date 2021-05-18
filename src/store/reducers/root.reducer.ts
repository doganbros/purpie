import { combineReducers } from 'redux';
import authReducer from './auth.reducer';
import meetingReducer from './meeting.reducer';
import tenantReducer from './tenant.reducer';
import utilReducer from './util.reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  meeting: meetingReducer,
  tenant: tenantReducer,
  util: utilReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
