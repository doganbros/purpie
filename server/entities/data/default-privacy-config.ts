import { PrivacyConfig } from '../../types/Meeting';

export const defaultPrivacyConfig: PrivacyConfig = {
  public: true,
  record: false,
  liveStream: false,
  joinLinkExpiryAsHours: 24,
};
