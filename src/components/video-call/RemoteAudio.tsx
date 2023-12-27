import React, { FC, useEffect, useRef } from 'react';
import { useJitsiContext } from './JitsiContext';

export const RemoteAudio: FC = () => {
  const { remoteTracks } = useJitsiContext();
  const track = remoteTracks.find((t) => t.getType() === 'audio');
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    track?.attach(audioElementRef.current);

    return () => {
      track?.detach(audioElementRef.current);
    };
  }, [track]);

  return <audio ref={audioElementRef} autoPlay />;
};
