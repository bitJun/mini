import { ChatContext } from '@/context/chatContext';
import uploadFile from '@/lib/request/upload';
import { SafeArea } from '@taroify/core';
import { CustomWrapper, ScrollView, View,Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useMemoizedFn } from 'ahooks';
import { PropsWithChildren, forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ChatUIContext } from '../context';
import styles from '../index.module.scss';
import { handelChooseImageFail } from '../tools';
import ChatFeature from './ChatFeature';
import ChatInput, { IChatInputHandle, IChatInputProps } from './ChatInput';
import { useStoreData } from '@/store';
type IChatFrameProps = {
  id: number;
  ref?: unknown; // 也许可以不这么写
  needInput?: boolean;
  scrollIntoView?: string;
  onScrollToUpper?: () => void;
  sourceMessageList?: Fetch.IQueryMessageListRes;
};

type IChatFrameHandle = {
  scrollToBottom: () => void;
};

const ChatFrame: React.FC<IChatFrameProps & PropsWithChildren> = forwardRef((props, ref) => {
  const context = useContext(ChatContext);
  const { systemInfo } = useStoreData(({ common }) => ({
    systemInfo: common.systemInfo,
  }));
  const { id, sourceMessageList, needInput = true, scrollIntoView, onScrollToUpper, children } = props;

  const chatInputRef = useRef<IChatInputHandle>(null);
  const safeAreaBottom = useRef(systemInfo.screenHeight - systemInfo.safeArea.bottom);
  const [chatInputBottom, setChatInputBottom] = useState<string>('0px');
  const [chatInputPaddingBottom, setChatPaddingBottom] = useState<string>(`${55 + safeAreaBottom.current}px`);
  const scrollViewNode = useRef();

  const [featureVisible, setFeatureVisible] = useState(false);
  const [sourceId, setSourceId] = useState(0);
  const [sourcePosition, setSourcePosition] = useState({
    top: 0,
    bottom: 0,
  });

  /** 初始化滚动到对话底部 */
  useEffect(() => {
    // 获取
    const selector = Taro.createSelectorQuery();
    selector.select('#scrollView').node();
    selector.exec((res) => {
      scrollViewNode.current = res[0].node;
      scrollToBottom();
    });
  }, []);

  /** 滚动到底部 */
  const scrollToBottom = useMemoizedFn(() =>
    setTimeout(() => {
      // setScrollTop((scrollTopRef.current += 1));
      // @ts-ignore
      // scrollViewNode.current?.scrollTo({ top: (scrollTopRef.current += 1) });
      context.scrollToBottom && context.scrollToBottom();
    }, 250),
  );
  /** 监听输入区高度变化事件 单位px */
  const handelInputHeightChange: IChatInputProps['onHeightChange'] = useMemoizedFn((height) => {
    // if (inputHeightRef.current === 0 || inputHeightRef.current === height) {
    //   inputHeightRef.current = height;
    //   return;
    // }
    setChatPaddingBottom(Taro.pxTransform(height + safeAreaBottom.current * 2));
    scrollToBottom();
  });
  /** 监听键盘高度变化 单位rpx */
  const handelKeyboardHeightChange: IChatInputProps['onKeyboardHeightChange'] = useMemoizedFn((height) => {
    scrollToBottom();
    setChatInputBottom(`${height}px`);
    if(height){
      setChatPaddingBottom(`${height + safeAreaBottom.current * 2}px`);
    }else{
      setChatPaddingBottom(`${55 + safeAreaBottom.current * 2}px`);
    }
  });
  /** 监听滚动事件 */
  // const handelScroll = useMemoizedFn(({ detail }) => {
  //   const { scrollTop } = detail;
  //   setScrollTop(scrollTop);
  // });
  /** 监听滚动到顶部事件 */
  const handelScrollToUpper = useMemoizedFn(() => {
    onScrollToUpper && onScrollToUpper();
  });

  /** 消息渲染区触摸事件 */
  const handelTouchStart = useMemoizedFn(() => {
    setFeatureVisible(false);
    chatInputRef.current?.handelUnfoldClose();
    Taro.hideKeyboard();
  });

  /** 消息长按事件 */
  const handelLongTap = useMemoizedFn((msgId) => {
    const item = sourceMessageList?.find((i) => i.id === msgId);
    if (!item) return;
    if (item.words) return;
    const query = Taro.createSelectorQuery();
    query.select(`#msg_${msgId}`).boundingClientRect();
    query.exec((res) => {
      setSourceId(msgId);
      setSourcePosition(res[0]);
      setFeatureVisible(true);
    });
  });

  /** 相册点击事件 */
  const handelPhotoClick = useMemoizedFn((event) => {
    event.stopPropagation();
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: async (res) => {
        const [result, error] = await uploadFile(res.tempFilePaths[0], { conversation_id: id, type: 2 });
        if (error || !result) return;
        // @ts-ignore
        context.createMessage && context.createMessage(result.content[0]);
        Taro.nextTick(() => scrollToBottom());
      },
      fail: handelChooseImageFail,
    });
  });

  /** 拍照点击事件 */
  const handelCameraClick = useMemoizedFn((event) => {
    event.stopPropagation();
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success: async (res) => {
        const [result, error] = await uploadFile(res.tempFilePaths[0], { conversation_id: id, type: 2 });
        if (error || !result) return;
        // @ts-ignore
        context.createMessage && context.createMessage(result.content[0]);
        Taro.nextTick(() => scrollToBottom());
      },
      fail: handelChooseImageFail,
    });
  });

  useImperativeHandle(ref, (): IChatFrameHandle => ({ scrollToBottom }), [scrollToBottom]);
  const { dicSetting } = useStoreData(({ common }) => ({
    dicSetting: common.dicSetting,
  }));
  const { userInfo } = useStoreData(({ user }) => ({
    userInfo: user.userInfo,
  }));
  return (
    <ChatUIContext.Provider
      value={{
        onLongTap: handelLongTap,
        onPhotoClick: handelPhotoClick,
        onCameraClick: handelCameraClick,
      }}
    >
      <View className={styles.chatFrame}>
        <View className={styles.headerBox}>
          <Image
            mode="widthFix"
            className={styles.imageStyle}
            src={dicSetting.length ? dicSetting[0].content.welcome.avatar : userInfo.avatar_path}
          />
          <View className={styles.desc}>
              <View className={styles.descLeft}>Hey,{userInfo.employee.name}</View>
              <View className={styles.descRight}>😊 有事儿，您尽管吩咐！</View>
          </View>
        </View>
        {/* 消息功能区 */}
        <CustomWrapper>
          <ChatFeature
            visible={featureVisible}
            setFeatureVisible={setFeatureVisible}
            msgId={sourceId}
            sourcePosition={sourcePosition}
          ></ChatFeature>
        </CustomWrapper>
        {/* 消息渲染区 */}
        <ScrollView
          id="scrollView"
          className={styles.scrollView}
          style={{ paddingBottom: needInput ? chatInputPaddingBottom : 0 }}
          enhanced
          // enablePassive="list"
          scroll-y
          scrollWithAnimation={false}
          // fastDeceleration
          // scrollTop={scrollTop}
          scrollIntoView={scrollIntoView}
          showScrollbar={false}
          // onScroll={handelScroll}
          onScrollToUpper={handelScrollToUpper}
          onTouchStart={handelTouchStart}
          scrollIntoViewWithinExtent={true}
        >
          <View className={styles.padding}>{children}</View>
        </ScrollView>
        {/* 消息输入区 */}
        {needInput && (
          <View className={styles.fixedBottom} style={{ bottom: chatInputBottom }}>
            <ChatInput
              ref={chatInputRef}
              onHeightChange={handelInputHeightChange}
              onKeyboardHeightChange={handelKeyboardHeightChange}
            ></ChatInput>
            {chatInputBottom === '0px' && <SafeArea position="bottom" />}
          </View>
        )}
      </View>
    </ChatUIContext.Provider>
  );
});

export { IChatFrameHandle, IChatFrameProps };
export default ChatFrame;
