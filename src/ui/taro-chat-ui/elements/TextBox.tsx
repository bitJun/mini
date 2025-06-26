import useInterval from '@/hooks/useInterval';
import { Text, View } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import classnames from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from '../index.module.scss';
import Router from '@/lib/router';
export type ITextBoxProps = {
  approve_status:number;
  text: string; // 文本内容
  mode: 'left' | 'right';
  animation?: 'thinking' | 'typewriter'; // 文本动画加载
  id:number;
  topics?:{
    summary:string;
    topic:string;
  }[]
};

const Cursor = () => {
  return <View className={styles.cursor}></View>;
};

const TextBox: React.FC<ITextBoxProps> = (props) => {
  const { mode, text, animation,approve_status,id, topics} = props;
  const [realText, setRealText] = useState<string>();
  const [cursor, setCursor] = useState<boolean>(false);
  const textSplit = useMemo(() => {
    if (!text) return [];
    return text.split('');
  }, [text]);
  const textIndex = useRef<number>(0);
  /** 打字机事件定义 */
  const typewriter = useMemoizedFn(() => {
    if (textIndex.current < textSplit.length) {
      setRealText(`${realText}${textSplit[textIndex.current]}`);
      textIndex.current++;
      return;
    }
    typewriterClear();
  });
  const [typewriterRun, typewriterClear] = useInterval(typewriter, 100);
  const typewriterReset = useMemoizedFn(() => {
    setRealText('');
    textIndex.current = 0;
    typewriterClear();
  });

  /** 动画模式处理 */
  useEffect(() => {
    setCursor(false); // 光标初始化
    typewriterReset(); // 打字机初始化
    switch (animation) {
      case 'thinking':
        setCursor(true);
        break;
      case 'typewriter':
        typewriterRun();
        break;
      default:
        setRealText(text);
        break;
    }
  }, [animation, text, typewriterReset, typewriterRun]);
  const viewTaskOptions = ['无需审批',"待审批","审批完成","超时自动通过"];
   /** 去对话页 */
   const goToShowork = useMemoizedFn(() => Router.navigate('LIngInt://showork',{ data: { id:id } }));
  return (
    <View className={classnames(styles.textBox, { [styles.other]: mode === 'left' })}>
      {/* 闪烁的光标 */}
      {cursor && <Cursor />}
      {/* 文本展示 */}
      {realText ? <Text user-select>{realText}</Text> : <Cursor />}
      {
        topics ? <View className={styles.topics}>
          {
            topics.map((item,index)=>{
              return <View key={index}>
                <View className={styles.topic}>{item.topic}</View>
                <View className={styles.summary}>{item.summary}</View>
              </View>
            })
          }
        </View> : null
      }
      {
        approve_status > 0 &&  
        <View className={styles.approve_status} onClick={goToShowork}>
          {viewTaskOptions[approve_status]}
        </View>
      }
    </View>
  );
};

export default TextBox;
