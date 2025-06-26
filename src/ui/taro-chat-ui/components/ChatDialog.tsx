import fetch from '@/lib/request';
import { FloatingBubble } from '@taroify/core';
import { Replay, ChatOutlined } from '@taroify/icons';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAsyncEffect, useMemoizedFn } from 'ahooks';
import classnames from 'classnames';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from '../index.module.scss';
import ChatFrame, { IChatFrameHandle } from './ChatFrame';
import ChatText from './ChatText';
import { ChatContext } from '@/context/chatContext';

type IChatDialogProps = {
  ref?: unknown; // 也许可以不这么写
  id: number;
  visible: boolean;
  loading?: boolean;
  switchVisible: () => void;
};

type IChatDialogHandle = {
  handelPushMessage: (content: any) => void;
};

const ChatDialog: React.FC<IChatDialogProps> = forwardRef((props, ref) => {
  const { id, visible, loading = false, switchVisible } = props;

  const chatFrameRef = useRef<IChatFrameHandle>(null);

  /** 消息的原始数据 */
  const [scrollIntoView, setScrollIntoView] = useState<string>();
  const [sourceMessageList, setSourceMessageList] = useState<Fetch.IQueryMessageListRes>([]);

  /** 页面初始化 */
  useAsyncEffect(async () => {
    if (!id) return;
    const [result, error] = await fetch.queryMessageList({ conversation_id: id, size: 10 });
    if (!result || error) return;
    setSourceMessageList(result);
  }, [id]);

  useEffect(() => {
    if (visible) {
      Taro.nextTick(() => {
        chatFrameRef.current?.scrollToBottom();
      });
    }
  }, [visible]);

  const handelPushMessage = useMemoizedFn((content) => {
    // 判断最后一条消息是否 'thinking'
    setSourceMessageList([...sourceMessageList, content]);
    chatFrameRef.current?.scrollToBottom();
  });

  const scrollToBottom = useMemoizedFn(() => {
    if (!sourceMessageList) return;
    const lastMsgId = sourceMessageList[sourceMessageList.length - 1].id;
    setScrollIntoView(``)
    Taro.nextTick(() => setScrollIntoView(`msg_${lastMsgId}`));
  });

  useImperativeHandle(ref, (): IChatDialogHandle => ({ handelPushMessage }), [handelPushMessage]);

  return (
    <ChatContext.Provider
      value={{
        scrollToBottom,
      }}
    >
      <View className={styles.chatDialog}>
        <View className={styles.content}>
          <FloatingBubble
            offset={{ x: 24, y: 600 }}
            axis="xy"
            magnetic="x"
            icon={loading ? <Replay className={styles.replay} /> : <ChatOutlined />}
            onClick={switchVisible}
          />
          {visible && (
            <View className={classnames(styles.chatDialogBox)}>
              <ChatFrame id={id} ref={chatFrameRef} scrollIntoView={scrollIntoView} needInput={false}>
                {sourceMessageList?.map((item) => {
                  return (
                    <View key={item.id}>
                      <ChatText
                        id={item.id}
                        mode={item.is_from_user ? 'right' : 'left'}
                        text={item.words}
                        time={item.create_time}
                        approve_status={item.approve_status}
                        topics={item.topics ? item.topics : []}
                      ></ChatText>
                    </View>
                  );
                })}
              </ChatFrame>
            </View>
          )}
        </View>
      </View>
      {/* 背景遮罩 */}
      {visible && <View className={styles.overlay} onClick={switchVisible}></View>}
    </ChatContext.Provider>
  );
});

export { IChatDialogHandle };
export default ChatDialog;
