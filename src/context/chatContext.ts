import { createContext } from 'react';

type IChatContextParams = {
  sendMessage?: (text: string) => void;
  createMessage?: (msg: any) => void;
  handelFeature?: (type: string, params: IAnyObject) => void;
  quote?: {
    text: string;
    data: IAnyObject;
  };
  clearQuote?: () => void;
  scrollToBottom?: () => void;
};

const contextParams: IChatContextParams = {
  sendMessage: (text: string) => {
    console.log(`sendMessage: ${text}`);
  },
  createMessage: (msg: any) => {
    console.log(`createMessage: ${msg}`);
  },
};

/** 聊天页面 context */
export const ChatContext = createContext(contextParams);
