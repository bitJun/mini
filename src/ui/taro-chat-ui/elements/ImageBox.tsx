import { Image, View,Video } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useMemoizedFn } from 'ahooks';
import styles from '../index.module.scss';
import { PlayCircle } from "@taroify/icons";
import Router from '@/lib/router';
import fetch from '@/lib/request';
export type IImageBoxProps = {
  url: string; // 图片地址
  type:number;
  work_id?:number;
};

const ImageBox: React.FC<IImageBoxProps> = (props) => {
  const { url,type,work_id } = props;
  /** 图片预览 */
  const previewImage = useMemoizedFn(() => {
    Taro.previewImage({
      current: url,
      urls: [url],
    });
  });
  /** 去对话页 */
  const fetchViewTask = useMemoizedFn(async () => {
    if(!work_id)return;
    Taro.showLoading({ title: '请求中',mask:true });
    const params = { work_id:work_id };
    const [result, error] = await fetch.getIdeaWork(params);
    Taro.hideLoading();
    if (!result || error) return;
    if(result.images && result.images.length){
      if(result.images[0].type === 2){
        Router.navigate('LIngInt://showork',{ data: { id:{
          content:result.content,
          title:result.title,
          items:[
            {
              works:[
                {
                  images:result.images
                }
              ]
            }
          ]
        }} })
      }else{
        Router.navigate('LIngInt://showorkPic',{ data: { item:result } })
      }
    }
  });
  return (
    <View className={styles.imageBox}>
      {
        type == 2 ?  
        <Video
          src={url}
          id="myVideoChat"
          autoplay={false}
          controls={false}
          objectFit='cover'
          className={styles.imageMode}
          custom-cache={false}
          initialTime={0}
          showCenterPlayBtn={true}
          enablePlayGesture={true}
        /> :  
        <Image className={styles.imageMode} mode="widthFix" onClick={previewImage} src={url}></Image>
      }
       {work_id && <PlayCircle className={styles.eyeIcon} onClick={fetchViewTask} />} 
    </View>
  );
};

export default ImageBox;
