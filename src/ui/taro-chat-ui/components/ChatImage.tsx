import useLongTap from '@/hooks/useLongTap';
import { formatTimestamp } from '@/tools/time';
import { View } from '@tarojs/components';
import classnames from 'classnames';
import { useContext } from 'react';
import { ChatUIContext } from '../context';
import Avatar from '../elements/Avatar';
import ImageBox, { IImageBoxProps } from '../elements/ImageBox';
import { IChatProps } from '../index';
import styles from '../index.module.scss';

type IChatImageProps = IChatProps;

const ChatImage: React.FC<IChatImageProps & IImageBoxProps> = (props) => {
  const context = useContext(ChatUIContext);
  const { id, mode, time, url,type,work_id } = props;

  /** 长按事件 */
  const useLongTapAttr = useLongTap({ callback: () => context.onLongTap && context.onLongTap(id) });

  return url ? (
    <View id={`msg_${id}`} className={classnames(styles.chatImage, styles[mode])}>
      {mode === 'left' && <Avatar mode={mode}></Avatar>}
      <View className={classnames(styles.column, styles[mode])}>
        <View className={styles.nickname}>{formatTimestamp((time || 0) * 1000, 'chat')}</View>
        <View className={styles.content} {...useLongTapAttr}>
          <ImageBox url={url}  type={type} work_id={work_id}></ImageBox>
        </View>
      </View>
      {mode === 'right' && <Avatar mode={mode}></Avatar>}
    </View>
  ) : null;
};

export default ChatImage;
