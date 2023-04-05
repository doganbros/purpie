export enum ErrorTypes {
  NOT_VALID = 'NOT_VALID',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  INITIAL_USER_SPECIFIED = 'INITIAL_USER_SPECIFIED',
  INITIAL_USER_REQUIRED = 'INITIAL_USER_REQUIRED',
  THIRD_PARTY_AUTH_ERROR = 'THIRD_PARTY_AUTH_ERROR',
  NOT_SIGNED_IN = 'NOT_SIGNED_IN',
  USER_ALREADY_REGISTERED = 'USER_ALREADY_REGISTERED',
  NOT_AUTHORIZED = 'NOT_AUTHORIZED',
  INVALID_JWT = 'INVALID_JWT',
  INVALID_AUTH_TYPE = 'INVALID_AUTH_TYPE',
  ERROR_USERNAME_OR_PASSWORD = 'ERROR_USERNAME_OR_PASSWORD',
  USER_DIDNT_REGISTER_WITH_PASSWORD = 'USER_DIDNT_REGISTER_WITH_PASSWORD',
  MUST_VERIFY_EMAIL = 'MUST_VERIFY_EMAIL',
  UNAUTHORIZED_SUBDOMAIN = 'UNAUTHORIZED_SUBDOMAIN',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_DISPLAY_PHOTO_NOT_FOUND = 'USER_DISPLAY_PHOTO_NOT_FOUND',
  INVALID_PASSWORD_RESET_TOKEN = 'INVALID_PASSWORD_RESET_TOKEN',
  INVALID_AUTH_CLIENT_CREDENTIALS = 'INVALID_AUTH_CLIENT_CREDENTIALS',
  INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',
  MESSAGE_NOT_DELETED = 'MESSAGE_NOT_DELETED',
  POST_NOT_FOUND = 'POST_NOT_FOUND',
  TEST_MAIL_FOR_ONLY_DEV = 'TEST_MAIL_FOR_ONLY_DEV',
  POST_COMMENTS_NOT_ALLOWED = 'POST_COMMENTS_NOT_ALLOWED',
  POST_REACTION_NOT_ALLOWED = 'POST_REACTION_NOT_ALLOWED',
  POST_DISLIKE_NOT_ALLOWED = 'POST_DISLIKE_NOT_ALLOWED',
  VIDEO_NOT_FOUND = 'VIDEO_NOT_FOUND',
  USER_NOT_CHANNEL_MEMBER = 'USER_NOT_CHANNEL_MEMBER',
  CONTACT_INVITATION_NOT_FOUND = 'CONTACT_INVITATION_NOT_FOUND',
  CONTACT_ELIGIBILITY_ERROR = 'CONTACT_ELIGIBILITY_ERROR',
  INVITATION_ALREADY_SENT_FOR_USER = 'INVITATION_ALREADY_SENT_FOR_USER',
  INVITATION_ALREADY_RECEIVED_FROM_USER = 'INVITATION_ALREADY_RECEIVED_FROM_USER',
  USER_BLOCKED_YOU = 'USER_BLOCKED_YOU',
  SUPER_ADMIN_NOT_EXIST = 'SUPER_ADMIN_NOT_EXIST',
  OWNER_NOT_EXIST = 'OWNER_NOT_EXIST',
  ROLE_ALREADY_EXISTS = 'ROLE_ALREADY_EXISTS',
  USER_ROLE_EXIST = 'USER_ROLE_EXIST',
  CHANGE_OWNER_PERMISSION = 'CHANGE_OWNER_PERMISSION',
  CHANGE_SUPER_ADMIN_PERMISSION = 'CHANGE_SUPER_ADMIN_PERMISSION',
  UPDATE_USER_PERMISSION_BAD_REQUEST = 'UPDATE_USER_PERMISSION_BAD_REQUEST',
  NO_CHANGES_DETECTED = 'NO_CHANGES_DETECTED',
  CANT_BLOCK_YOURSELF = 'CANT_BLOCK_YOURSELF',
  CANT_UNBLOCK_YOURSELF = 'CANT_UNBLOCK_YOURSELF',
  CHANNEL_NOT_FOUND = 'CHANNEL_NOT_FOUND',
  ZONE_NOT_FOUND = 'ZONE_NOT_FOUND',
  ZONE_SUBDOMAIN_ALREADY_EXIST = 'ZONE_SUBDOMAIN_ALREADY_EXIST',
  INVITATION_NOT_FOUND = 'INVITATION_NOT_FOUND',
  USER_PAYLOAD_REQUIRED = 'USER_PAYLOAD_REQUIRED',
  USER_ALREADY_INVITED_TO_CHANNEL = 'USER_ALREADY_INVITED_TO_CHANNEL',
  USER_ALREADY_MEMBER_OF_CHANNEL = 'USER_ALREADY_MEMBER_OF_CHANNEL',
  USER_ALREADY_MEMBER_OF_ZONE = 'USER_ALREADY_MEMBER_OF_ZONE',
  USER_ALREADY_INVITED_TO_ZONE = 'USER_ALREADY_INVITED_TO_ZONE',
  COULD_NOT_CREATE_MEETING = 'COULD_NOT_CREATE_MEETING',
  EDIT_POST_PAYLOAD_EMPTY = 'EDIT_POST_PAYLOAD_EMPTY',
  ROLE_CODE_ALREADY_EXISTS = 'ROLE_CODE_ALREADY_EXISTS',
  USERS_USING_ROLE = 'USERS_USING_ROLE',
  FIELDS_FOR_UPDATES_NOT_SPECIFIED = 'FIELDS_FOR_UPDATES_NOT_SPECIFIED',
  MEETING_RECORDING_NOT_ENABLED = 'MEETING_RECORDING_NOT_ENABLED',
  MEETING_NOT_FOUND = 'MEETING_NOT_FOUND',

  POST_FOLDER_NOT_FOUND = 'POST_FOLDER_NOT_FOUND',
  POST_FOLDER_ITEM_NOT_FOUND = 'POST_FOLDER_ITEM_NOT_FOUND',

  INVALID_IMAGE_FORMAT = 'INVALID_IMAGE_FORMAT',
  INVALID_VIDEO_FORMAT = 'INVALID_VIDEO_FORMAT',

  PASSWORDS_NOT_MATCH = 'PASSWORDS_NOT_MATCH',
  CURRENT_PASSWORD_NOT_CORRECT = 'CURRENT_PASSWORD_NOT_CORRECT',
  OWNER_CANT_UNFOLLOW_CHANNEL = 'OWNER_CANT_UNFOLLOW_CHANNEL',
}
