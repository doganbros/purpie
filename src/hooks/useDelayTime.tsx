import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface UseDelayTimeReturnTypes {
  delay: boolean;
  setDelay: Dispatch<SetStateAction<boolean>>;
}

// this hook is for loading screens
// website loads too fast, it seems there is an error, we added artificial delay

const useDelayTime = (delayTime: number): UseDelayTimeReturnTypes => {
  const [delay, setDelay] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelay(false);
    }, delayTime);
    return () => clearTimeout(timer);
  }, [delay]);
  return { delay, setDelay };
};

export default useDelayTime;
