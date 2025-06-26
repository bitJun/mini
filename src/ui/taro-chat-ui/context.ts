import { ITouchEvent } from '@tarojs/components';
import { createContext } from 'react';

type IChatUIContextParams = {
  onLongTap?: (msg_id: number) => void;
  onPhotoClick?: (event: ITouchEvent) => void;
  onCameraClick?: (event: ITouchEvent) => void;
};

const contextParams: IChatUIContextParams = {
  onLongTap: (msg_id: number) => {
    console.log(`消息-${msg_id} 被长按了`);
  },
  onPhotoClick: (e) => {
    console.log(`相册按钮被点击了`);
    e.stopPropagation();
  },
  onCameraClick: (e) => {
    console.log(`拍照按钮被点击了`);
    e.stopPropagation();
  },
};

export const ChatUIContext = createContext(contextParams);
