import { useMemoizedFn } from 'ahooks';
import { useRef } from 'react';

type IUseIntervalParams = {
  fn: () => void;
  delay?: number;
};

const useInterval = (fn: IUseIntervalParams['fn'], delay: IUseIntervalParams['delay']) => {
  const intervalRef = useRef<NodeJS.Timeout>();

  const run = useMemoizedFn(() => {
    intervalRef.current = setInterval(fn, delay);
  });

  const clear = useMemoizedFn(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  });

  return [run, clear];
};

export default useInterval;
