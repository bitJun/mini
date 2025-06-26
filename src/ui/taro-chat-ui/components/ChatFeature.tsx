import { ChatContext } from '@/context/chatContext';
import { CommentCircle } from '@taroify/icons';
import { View } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import { useContext, useEffect, useState } from 'react';
import styles from '../index.module.scss';

type IChatFeatureProps = {
  msgId: number;
  visible: boolean;
  setFeatureVisible: (v: boolean) => void;
  sourcePosition: {
    top: number;
    bottom: number;
  };
};

const ChatFeature: React.FC<IChatFeatureProps> = (props) => {
  const context = useContext(ChatContext);
  const { msgId, visible, setFeatureVisible, sourcePosition } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [fixedTop, setFixedTop] = useState<number>(100);

  useEffect(() => {
    if (visible) {
      // 计算位置
      console.log(sourcePosition);
      const { top, bottom } = sourcePosition;
      top > 200 ? setFixedTop(top - 40) : setFixedTop(bottom + 10);
    }
    setOpen(visible);
  }, [visible]);

  // 引用
  const handelQuote = useMemoizedFn(() => {
    console.log(msgId);
    context.handelFeature && context.handelFeature('quote', { msgId });
    setFeatureVisible(false);
  });

  /** 位置确认 */
  return open ? (
    <View className={styles.chatFeature} style={{ top: `${fixedTop}px` }}>
      <View className={styles.featureItem} onClick={handelQuote}>
        <CommentCircle color="#fff" size={30} />
        <View className={styles.featureText}>引用</View>
      </View>
    </View>
  ) : null;
};

export default ChatFeature;
