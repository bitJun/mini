import { ChatContext } from '@/context/chatContext';
import Input from '@/extend/Input';
import { Add, Clear, Photo, Photograph } from '@taroify/icons';
import { View,Image } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import { ChatUIContext } from '../context';
import styles from '../index.module.scss';
import Router from '@/lib/router';
type IChatInputProps = {
  ref?: unknown; // 也许可以不这么写
  onHeightChange?: (height: number) => void;
  onKeyboardHeightChange?: (height: number) => void;
};

type IChatInputHandle = {
  handelUnfoldClose: () => void;
};

const ChatInput: React.FC<IChatInputProps> = forwardRef((props, ref) => {
  const context = useContext(ChatContext);
  const contextUI = useContext(ChatUIContext);
  const defaultHeight = useRef<number>(100); // 默认高度
  const openHeight = useRef<number>(500); // 展开高度

  // const [height, setHeight] = useState<number>(defaultHeight.current);
  const [showQuickOperation, setShowQuickOperation] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  /** 消息输入事件 */
  const handelInput: Input.onInput = useMemoizedFn(({ detail }) => setValue(detail.value));
  /** 消息发送事件 */
  const handelConfirm: Input.onConfirm = useMemoizedFn(({}) => {
    if(context.sendMessage){
      context.sendMessage(value);
    }
    setValue(''); // 发送消息后清空输入框
  });
  /** 键盘高度变化 */
  const handelKeyboardHeightChange: Input.onKeyboardHeightChange = useMemoizedFn(
    ({ detail }) => props.onKeyboardHeightChange?.(detail.height),
  );

  /** 展开快捷操作 */
  const handelUnfoldOpen = useMemoizedFn(() => {
    if (showQuickOperation === true) return;
    // setHeight(openHeight.current);
    setShowQuickOperation(true);
    props.onHeightChange?.(openHeight.current);
  });

  /** 收起快捷操作 */
  const handelUnfoldClose = useMemoizedFn(() => {
    if (showQuickOperation === false) return;
    // setHeight(defaultHeight.current);
    setShowQuickOperation(false);
    props.onHeightChange?.(defaultHeight.current);
  });
  useImperativeHandle(ref, (): IChatInputHandle => ({ handelUnfoldClose }), [handelUnfoldClose]);

  return (
    <View className={styles.chatInput}>
      {/* 输入区域 */}
      <View className={styles.InputArea}>
        <Image
          mode="widthFix"
          className={styles.img}
          src={'https://lingint-front.oss-cn-shanghai.aliyuncs.com/sun.png'}
        />
        <View className={styles.input}>
          <View className={styles.box}>
            <Input
              height={80}
              value={value}
              color='#fff'
              placeholder=""
              onInput={handelInput}
              onConfirm={handelConfirm}
              onKeyboardHeightChange={handelKeyboardHeightChange}
            ></Input>
          </View>
          {/* 引用 */}
          {context.quote && (
            <View className={styles.quote}>
              <View>{context.quote.text}</View>
              <Clear onClick={context.clearQuote} />
            </View>
          )}
        </View>
        {
          value.length ? <View className={styles.sendBtn} onClick={handelConfirm}>发送</View> : <View className={styles.unfold} onClick={handelUnfoldOpen}>
          <Add size={36} />
        </View>
        }
        
      </View>
      {/* 快捷按钮区 */}
      {showQuickOperation && (
        <View className={styles.quickOperationArea}>
          <View className={styles.quickOperationItem} onClick={contextUI.onPhotoClick}>
            <View className={styles.quickOperationIcon}>
              <Photo size={30} />
            </View>
            <View className={styles.quickOperationText}>本地上传</View>
          </View>
          <View className={styles.quickOperationItem} onClick={contextUI.onCameraClick}>
            <View className={styles.quickOperationIcon}>
              <Photograph size={30} />
            </View>
            <View className={styles.quickOperationText}>立即拍摄</View>
          </View>
        </View>
      )}
    </View>
  );
});

export { IChatInputHandle, IChatInputProps };
export default ChatInput;
