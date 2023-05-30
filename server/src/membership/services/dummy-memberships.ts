export const dummyMemberships = [
  {
    type: 'FREE',
    actions: {
      channelCount: 1,
      zoneCount: 1,
      meetingCount: 1,
      streamCount: 0,
      webinarCount: 0,
      streamingStudioCount: 0,
    },
  },
  {
    type: 'BASIC',
    actions: {
      channelCount: 5,
      zoneCount: 2,
      meetingCount: 50,
      streamCount: 1,
      webinarCount: 1,
      streamingStudioCount: 1,
    },
  },
  {
    type: 'STANDARD',
    actions: {
      channelCount: 50,
      zoneCount: 20,
      meetingCount: 100,
      streamCount: 5,
      webinarCount: 5,
      streamingStudioCount: 5,
    },
  },
  {
    type: 'PRO',
    actions: {
      channelCount: -1,
      zoneCount: -1,
      meetingCount: 300,
      streamCount: 50,
      webinarCount: 50,
      streamingStudioCount: 40,
    },
  },
];
