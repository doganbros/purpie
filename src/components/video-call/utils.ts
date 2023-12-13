export const JITSI_INIT_CONFIG = {
  disableAudioLevels: true,
};

const HOST = 'meet.purpie.io';
export const JITSI_CONNECTION_CONFIG = {
  hosts: {
    domain: HOST,
    muc: `conference.${HOST}`,
  },
  serviceUrl: `https://${HOST}/http-bind`,
  clientNode: 'http://jitsi.org/jitsimeet',
  resolution: 320,
  constraints: {
    video: {
      height: {
        ideal: 320,
        max: 320,
        min: 180,
      },
    },
  },
};

export const JITSI_CONFERENCE_CONFIG = {
  openBridgeChannel: true,
  p2p: { enabled: false },
};

export const defaultContextValues = {
  participants: [] as any[],
  localTracks: [] as any[],
  remoteTracks: [] as any[],
  jitsiConnection: {},
  jitsiConference: {},
  createLocalTracks: (() => {}) as () => void,
  removeLocalTracks: (() => {}) as () => void,
  changeDevices: (() => {}) as (
    cameraDeviceId?: string,
    micDeviceId?: string
  ) => void,
};

export const enumerateDevices = (): Promise<MediaDeviceInfo[]> =>
  new Promise<MediaDeviceInfo[]>((resolve) => {
    JitsiMeetJS.mediaDevices?.enumerateDevices(
      (mediaDevices: MediaDeviceInfo[]) => resolve(mediaDevices)
    );
  });
