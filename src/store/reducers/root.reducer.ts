import { combineReducers } from 'redux';
import activityReducer from './activity.reducer';
import authReducer from './auth.reducer';
import channelReducer from './channel.reducer';
import mattermostReducer from './mattermost.reducer';
import meetingReducer from './meeting.reducer';
import utilReducer from './util.reducer';
import videoReducer from './video.reducer';
import zoneReducer from './zone.reducer';

const rootReducer = combineReducers({
  activity: activityReducer,
  auth: authReducer,
  channel: channelReducer,
  zone: zoneReducer,
  meeting: meetingReducer,
  util: utilReducer,
  mattermost: mattermostReducer,
  video: videoReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
