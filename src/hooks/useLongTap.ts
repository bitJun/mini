import { Timeout } from 'ahooks/lib/useRequest/src/types';
import { useRef } from 'react';

type IUseLongTapOptions = {
  callback: () => void;
};

const useLongTap = (options: IUseLongTapOptions) => {
  const { callback } = options;

  /** 计时器 */
  const timer = useRef<Timeout>();
  const time = useRef<number>(500);
  /** 计时器状态 0 - 未启动 1 -计时中 */
  const timepieceStatus = useRef<number>(0);

  return {
    onTouchStart: () => {
      timepieceStatus.current = 1;
      timer.current = setTimeout(() => {
        if (timepieceStatus.current) {
          callback();
        }
      }, time.current);
    },
    onTouchEnd: () => {
      timepieceStatus.current = 0;
      timer.current && clearTimeout(timer.current);
    },
  };
};

export default useLongTap;
