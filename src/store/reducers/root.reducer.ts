import { combineReducers } from 'redux';
import activityReducer from './activity.reducer';
import authReducer from './auth.reducer';
import channelReducer from './channel.reducer';
import chatReducer from './chat.reducer';
import meetingReducer from './meeting.reducer';
import postReducer from './post.reducer';
import userReducer from './user.reducer';
import utilReducer from './util.reducer';
import zoneReducer from './zone.reducer';
import folderReducer from './folder.reducer';
import invitationReducer from './invitation.reducer';
import membershipReducer from './membership.reducer';

const rootReducer = combineReducers({
  activity: activityReducer,
  auth: authReducer,
  channel: channelReducer,
  meeting: meetingReducer,
  post: postReducer,
  util: utilReducer,
  user: userReducer,
  zone: zoneReducer,
  chat: chatReducer,
  folder: folderReducer,
  invitation: invitationReducer,
  membership: membershipReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
