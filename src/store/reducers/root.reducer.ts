import { combineReducers } from 'redux';
import mattermostReducers from 'mattermost-redux/reducers';
import activityReducer from './activity.reducer';
import authReducer from './auth.reducer';
import channelReducer from './channel.reducer';
import meetingReducer from './meeting.reducer';
import utilReducer from './util.reducer';
import zoneReducer from './zone.reducer';

const rootReducer = combineReducers({
  activity: activityReducer,
  auth: authReducer,
  channel: channelReducer,
  zone: zoneReducer,
  meeting: meetingReducer,
  util: utilReducer,
  ...mattermostReducers,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
