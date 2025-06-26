import useImageInject from '@/hooks/useImageInject';
import { Video, View } from '@tarojs/components';
import { Image } from "@taroify/core"
import styles from './index.module.scss';
import { useMemo,useState } from 'react';
import { Play } from "@taroify/icons"
type IMediaProps = {
  media: any;
};

const Media: React.FC<IMediaProps> = (props) => {
  const { media } = props;
  const [isPaused, setIsPaused] = useState(false);
  const [id, setId] = useState(-1);
  const { formatWatermark } = useImageInject();

  const isImage = useMemo(() => [0, 1].includes(media.type), [media]);
  const handlePlay = () => {
    setIsPaused(true);
  };
  const handlePause = () => {
    setIsPaused(false);
  }
  return (
    <>
      {isImage ? (
        <Image className={styles.media} placeholder="加载中..." src={formatWatermark(media.http_img_path)} lazyLoad	={true} mode='aspectFill'></Image>
      ) : (
        <View className={styles.videoBox}>
           {
            (!isPaused || id != media.id) && <Image className={styles.media} placeholder="加载中..." src={formatWatermark(media.head_img_path)} lazyLoad	={true} mode='aspectFill' onClick={(e)=>{
              e.stopPropagation();
              setIsPaused(true);
              setId(media.id);
            }}></Image>
           }
           {
            isPaused && id == media.id ? <Video
              key={id}
              autoplay={true}
              controls={false}
              objectFit='cover'
              custom-cache={false}
              initialTime={0}
              showCenterPlayBtn={false}
              enablePlayGesture={true}
              src={media.http_img_path}
              className={styles.video}
              onPlay={handlePlay}
              onPause={handlePause}
            /> : <Play  onClick={(e)=>{
              e.stopPropagation();
              setIsPaused(true);
              setId(media.id);
            }} className={styles.iconS} />
           }
        </View>
      )}
    </>
  );
};

export default Media;
