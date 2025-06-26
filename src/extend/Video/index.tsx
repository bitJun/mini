import { Video,CustomWrapper,View } from '@tarojs/components';
import styles from './index.module.scss';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { Play } from "@taroify/icons"
type IExtendInputProps = {
  mediaUrl:string;
  vKey?:number
};

const ExtendVideo: React.FC<IExtendInputProps> = (props) => {
  const { mediaUrl,vKey } = props;
  const [isPaused, setIsPaused] = useState(false);

  const handlePlay = () => {
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  }
  return (
    <View
      className={styles.container}
    >
      <CustomWrapper>
        <Video 
          key={vKey || 9999999}
          autoplay={false}
          controls={false}
          objectFit='cover'
          custom-cache={false}
          initialTime={0}
          showCenterPlayBtn={true}
          enablePlayGesture={true}
          src={mediaUrl} 
          onPlay={handlePlay}
          onPause={handlePause}
        />
        {isPaused && <Play />}
      </CustomWrapper>
    </View>
  );
};

export default ExtendVideo;
