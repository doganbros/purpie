import { combineReducers } from 'redux';
import activityReducer from './activity.reducer';
import authReducer from './auth.reducer';
import channelReducer from './channel.reducer';
import mattermostReducer from './mattermost.reducer';
import meetingReducer from './meeting.reducer';
import postReducer from './post.reducer';
import utilReducer from './util.reducer';
import zoneReducer from './zone.reducer';

const rootReducer = combineReducers({
  activity: activityReducer,
  auth: authReducer,
  channel: channelReducer,
  mattermost: mattermostReducer,
  meeting: meetingReducer,
  post: postReducer,
  util: utilReducer,
  zone: zoneReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
