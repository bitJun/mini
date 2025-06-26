import { View, Image,Video } from '@tarojs/components';
import styles from '../index.module.scss';
import { useMemoizedFn } from 'ahooks';
import Taro from '@tarojs/taro';

export type IQuoteBoxProps = {
  quoteUrl?: string;
  type?:number
};

const QuoteBox: React.FC<IQuoteBoxProps> = (props) => {
  const { quoteUrl,type } = props;

  /** 图片预览 */
  const previewImage = useMemoizedFn(() => {
    if (!quoteUrl) return;
    Taro.previewImage({
      current: quoteUrl,
      urls: [quoteUrl],
    });
  });

  return quoteUrl ? (
    <View className={styles.chatQuote}>
      {/* <Image src={quoteUrl} className={styles.imageQuote} onClick={previewImage}></Image> */}
      {
        type == 2 ?  
        <Video
          src={quoteUrl}
          autoplay={false}
          controls={false}
          objectFit='cover'
          className={styles.imageQuote}
          custom-cache={false}
          initialTime={0}
          showCenterPlayBtn={true}
          enablePlayGesture={true}
        /> :  
        <Image className={styles.imageQuote} mode="widthFix" onClick={previewImage} src={quoteUrl}></Image>
      }
    </View>
  ) : null;
};

export default QuoteBox;
