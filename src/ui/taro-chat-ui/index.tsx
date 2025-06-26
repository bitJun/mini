import ChatDialog, { IChatDialogHandle } from './components/ChatDialog';
import ChatFrame from './components/ChatFrame';
import ChatImage from './components/ChatImage';
import ChatText from './components/ChatText';


export type IChatProps = {
  id: number;
  mode: 'left' | 'right'; // 模式
  time?: number;
  timeStr?:string;
};

const ChatUI = {
  Dialog: ChatDialog,
  Frame: ChatFrame,
  Text: ChatText,
  Image: ChatImage
};

export { IChatDialogHandle };
export default ChatUI;
