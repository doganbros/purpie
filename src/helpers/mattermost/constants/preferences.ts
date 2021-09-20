// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

const Preferences = {
  CATEGORY_CHANNEL_OPEN_TIME: 'channel_open_time',
  CATEGORY_CHANNEL_APPROXIMATE_VIEW_TIME: 'channel_approximate_view_time',
  CATEGORY_DIRECT_CHANNEL_SHOW: 'direct_channel_show',
  CATEGORY_GROUP_CHANNEL_SHOW: 'group_channel_show',
  CATEGORY_FLAGGED_POST: 'flagged_post',
  CATEGORY_AUTO_RESET_MANUAL_STATUS: 'auto_reset_manual_status',
  CATEGORY_NOTIFICATIONS: 'notifications',
  COLLAPSED_REPLY_THREADS: 'collapsed_reply_threads',
  COLLAPSED_REPLY_THREADS_OFF: 'off',
  COLLAPSED_REPLY_THREADS_ON: 'on',
  COLLAPSED_REPLY_THREADS_FALLBACK_DEFAULT: 'off',
  COMMENTS: 'comments',
  COMMENTS_ANY: 'any',
  COMMENTS_ROOT: 'root',
  COMMENTS_NEVER: 'never',
  EMAIL: 'email',
  EMAIL_INTERVAL: 'email_interval',
  INTERVAL_FIFTEEN_MINUTES: 15 * 60,
  INTERVAL_HOUR: 60 * 60,
  INTERVAL_IMMEDIATE: 30,

  // "immediate" is a 30 second interval
  INTERVAL_NEVER: 0,
  INTERVAL_NOT_SET: -1,
  CATEGORY_DISPLAY_SETTINGS: 'display_settings',
  NAME_NAME_FORMAT: 'name_format',
  DISPLAY_PREFER_NICKNAME: 'nickname_full_name',
  DISPLAY_PREFER_FULL_NAME: 'full_name',
  DISPLAY_PREFER_USERNAME: 'username',
  MENTION_KEYS: 'mention_keys',
  USE_MILITARY_TIME: 'use_military_time',

  CATEGORY_CUSTOM_STATUS: 'custom_status',
  NAME_CUSTOM_STATUS_TUTORIAL_STATE: 'custom_status_tutorial_state',
  NAME_RECENT_CUSTOM_STATUSES: 'recent_custom_statuses',
  CUSTOM_STATUS_MODAL_VIEWED: 'custom_status_modal_viewed',

  CATEGORY_SIDEBAR_SETTINGS: 'sidebar_settings',
  CHANNEL_SIDEBAR_ORGANIZATION: 'channel_sidebar_organization',
  LIMIT_VISIBLE_DMS_GMS: 'limit_visible_dms_gms',
  SHOW_UNREAD_SECTION: 'show_unread_section',
  CATEGORY_ADVANCED_SETTINGS: 'advanced_settings',
  ADVANCED_FILTER_JOIN_LEAVE: 'join_leave',
  ADVANCED_CODE_BLOCK_ON_CTRL_ENTER: 'code_block_ctrl_enter',
  ADVANCED_SEND_ON_CTRL_ENTER: 'send_on_ctrl_enter',
  CATEGORY_WHATS_NEW_MODAL: 'whats_new_modal',
  HAS_SEEN_SIDEBAR_WHATS_NEW_MODAL: 'has_seen_sidebar_whats_new_modal',
  CATEGORY_THEME: 'theme',
};

export default Preferences;
