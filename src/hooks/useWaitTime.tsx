import { useEffect, useState } from 'react';

const useWaitTime = (waitTime: number): boolean => {
  const [waiting, setWaiting] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setWaiting(false);
    }, waitTime);
    return () => clearTimeout(timer);
  }, []);
  return waiting;
};

export default useWaitTime;
