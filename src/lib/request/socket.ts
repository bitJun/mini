import Taro, { SocketTask } from '@tarojs/taro';
import Proxy from '@/config/proxy';
import { getToken, buildUserMessage } from './tools';

type IConnectParams = {
  key: string;
  id: number;
  onMessage: (data: IAnyObject) => void;
  onError?: (msg: string) => void;
};

type ISendParams = {
  data: IAnyObject;
  onSuccess?: () => void;
  onFail?: () => void;
};

/** 任务 */
let task: SocketTask | null = null;
/** 计时器 */
let timer: NodeJS.Timeout | null = null;

const messagePool = {};
const errorPool = {};

const socket = {
  /** 连接 */
  connect: async (params: IConnectParams) => {
    const { key, onMessage, onError,id } = params;
    messagePool[key] = onMessage;
    onError && (errorPool[key] = onError);
    if (task) return;
    const token = getToken();
    task = await Taro.connectSocket({
      url: `${process.env.NODE_ENV === 'production' ? Proxy.online_ws : Proxy.dev_ws}/api/chat/ws?token=${token}&conversation_id=${id}`,
    });
    // 存储线程池
    task.onOpen(() => {
      /** 连接成功 注册心跳机制 间隔3s */
      timer = setInterval(() => heartbeat(id), 3000);
    });
    task.onMessage(({ data }) => {
      const response = JSON.parse(data);
      /** 排除心跳返回 data 为 null 默认为心跳返回 */
      if (response.data) {
        console.log('socket onMessage');
        Object.keys(messagePool).forEach((key) => {
          if (!messagePool[key]) return;
          messagePool[key](response.data);
        });
      }
    });
    task.onError((error) => {
      console.warn('task.onError', error);
      Object.keys(errorPool).forEach((key) => {
        if (!errorPool[key]) return;
        errorPool[key](error.errMsg);
      });
    });
  },
  /** 发送消息 */
  send: (params: ISendParams) => {
    if (!task) return;
    const { data, onSuccess, onFail } = params;
    task.send({
      data: JSON.stringify(data),
      success: () => onSuccess && onSuccess(),
      fail: () => onFail && onFail(),
    });
  },
  /** 断开连接 */
  close: () => {
    if (task && timer) {
      clearInterval(timer); // 关闭心跳发送
      task.close({}); // 关闭socket连接
      task = null; // 清除连接
    }
  },
  /** 清空缓存池 */
  remove: (key: string) => {
    if (!key) return;
    if (messagePool[key]) messagePool[key] = null;
    if (errorPool[key]) errorPool[key] = null;
  },
};

/** 心跳机制 */
const heartbeat = (id) => {
  socket.send({
    data: { type: 0 }, // 心跳
    onFail: () => {
      socket.close(); // 清空任务
      console.warn(`socket 心跳失败`);
      // TODO: 重连机制
      Object.keys(messagePool).forEach((key) => {
        if (!messagePool[key]) return;
        const onMessage = messagePool[key];
        let onError = errorPool[key] ?? null;
        socket.connect({ key, onMessage, onError,id });
      });
    },
  });
};

export { buildUserMessage };
export default socket;
