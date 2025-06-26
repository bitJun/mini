import useLongTap from '@/hooks/useLongTap';
import { formatTimestamp } from '@/tools/time';
import { View } from '@tarojs/components';
import classnames from 'classnames';
import { useContext } from 'react';
import { ChatUIContext } from '../context';
import Avatar from '../elements/Avatar';
import QuoteBox, { IQuoteBoxProps } from '../elements/QuoteBox';
import TextBox, { ITextBoxProps } from '../elements/TextBox';
import { IChatProps } from '../index';
import styles from '../index.module.scss';

type IChatTextProps = IChatProps & ITextBoxProps & IQuoteBoxProps;

const ChatText: React.FC<IChatTextProps> = (props) => {
  const context = useContext(ChatUIContext);
  const { id, mode, text, time, animation, quoteUrl,approve_status,type,topics } = props;
  /** 长按事件 */
  const useLongTapAttr = useLongTap({ callback: () => context.onLongTap && context.onLongTap(id) });

  return text ? (
    <View id={`msg_${id}`} className={classnames(styles.chatText, styles[mode])}>
      <View className={classnames(styles.column, styles[mode])}>
        <View className={styles.content} {...useLongTapAttr}>
          <TextBox id={id} mode={mode} text={text} animation={animation} approve_status={approve_status} topics={topics}></TextBox>
          {
            quoteUrl && <QuoteBox quoteUrl={quoteUrl} type={type}></QuoteBox>
          }
        </View>
         <View className={styles.nickname}>{formatTimestamp(time ? time * 1000 : new Date().getTime(), 'chat')}</View>
      </View>
    </View>
  ) : null;
};

export default ChatText;
