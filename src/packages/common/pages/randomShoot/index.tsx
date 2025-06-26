import { View,Image,Text,Button } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import styles from './index.module.scss';
import Taro from '@tarojs/taro';
import fetch from '@/lib/request';
import logo from '@/assets/logo-light.png';
import { Passed,Cross } from "@taroify/icons";
import { Dialog } from "@taroify/core";
import uploadFile from '@/lib/request/upload';
import { useStoreData } from '@/store';
import classnames from 'classnames';
const listDemo = [
  {
    url:'https://image.aindecor.co/AInDecorBase/source_data/material_require/shake.jpg',
    nav:'抖动'
  },
  {
    url:'https://image.aindecor.co/AInDecorBase/source_data/material_require/blur.jpg',
    nav:'模糊'
  },
  {
    url:'https://image.aindecor.co/AInDecorBase/source_data/material_require/dark.jpg',
    nav:'昏暗'
  },
  {
    url:'https://image.aindecor.co/AInDecorBase/source_data/material_require/overexposed.jpg',
    nav:'过曝'
  }
]
const listDemoClone = [
  {
    url:'https://image.aindecor.co/AInDecorBase/source_data/clone_require/1.jpg',
    nav:'挡嘴'
  },
  {
    url:'https://image.aindecor.co/AInDecorBase/source_data/clone_require/2.jpg',
    nav:'出框'
  },
  {
    url:'https://image.aindecor.co/AInDecorBase/source_data/clone_require/3.jpg',
    nav:'侧脸'
  },
  {
    url:'https://image.aindecor.co/AInDecorBase/source_data/clone_require/4.jpg',
    nav:'多人'
  }
]
type IProps = {
  from:string;
  maId:number;
  showDia:boolean;
  setShowDia:(a:boolean) => void;
  reflexData:(images?:[]) => void;
};
const RandomShoot :React.FC<IProps> = (props) => {
  const { showDia,setShowDia,maId,reflexData,from} = props;
  const { chatList } = useStoreData(({ common }) => ({
    chatList: common.chatList
  }));
  const handleChooseMedia = () => {
    Taro.chooseMedia({
      maxDuration:60,
      count: 1,  // 可以选择的图片或视频数量
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success:async({tempFiles})=> {
        const [result, error] = await uploadFile(tempFiles[0].tempFilePath, { conversation_id: chatList[0].id}, { bigFile: true });
        if (error || !result) return;
        if(from == 'm' || from == 'cloneV' || from == 'clone'){
          reflexData(result[0].images);
        }else{
          materialDemandFn(result[0].images[0].id)
        }
      },
      fail(err) {
        console.error('选择媒体失败：', err);
      }
    });
    if(from != 'm'){
      setShowDia(false);
    }
  };
  const handleTakePhoto = (type?:string) => {
    Taro.chooseImage({
      sourceType: type == 'local' ? ['album'] : ['camera'],
      count: 1,
      success:async({tempFiles})=> {
        console.log(tempFiles,'kkk')
        const [result, error] = await uploadFile(tempFiles[0].path, { conversation_id: chatList[0].id}, { bigFile: true });
        if (error || !result) return;
        if(from == 'm' || from == 'clone'){
          reflexData(result[0].images);
        }else{
          materialDemandFn(result[0].images[0].id)
        }
      },
      fail(err) {
        console.error('拍照失败：', err);
      }
    });
    setShowDia(false);
  };
  const handleTakeVideo = (type?:string) => {
    Taro.chooseVideo({
      sourceType: type == 'local' ? ['album'] : ['camera'],
      success:async(res)=> {
        const [result, error] = await uploadFile(res.tempFilePath, { conversation_id: chatList[0].id}, { bigFile: true });
        if (error || !result) return;
        if(from == 'm'  || from == 'cloneV' || from == 'v'){
          reflexData(result[0].images);
        }else{
          materialDemandFn(result[0].images[0].id)
        }
      },
      fail(err) {
        console.error('拍视频失败：', err);
      }
    });
    setShowDia(false);
  };
  const materialDemandFn = useMemoizedFn(async (image_id) => {
    if(maId < 0) return;
    Taro.showLoading({ title: '请求中',mask:true });
    const params = { id:maId,image_id };
    const [result, error] = await fetch.materialDemand(params);
    Taro.hideLoading();
    if (!result || error) return;
    reflexData();
  });
  const listDemoFn = ()=>{
    if(from != 'clone' && from != 'cloneV'){
      return listDemo
    }else{
      return listDemoClone
    }
  }
  return (
    <Dialog open={showDia} onClose={setShowDia} className={classnames(styles.myDialog,{[styles.myDialogR]:from=='work'})}>
      <Dialog.Content>
        <View>
          <View style={{display:'flex',justifyContent:'center'}}>
            <Image className={styles.logo} src={logo} />
          </View>
          <View className={styles.phoneBoxTop}>
            <View className={styles.phoneBoxTitle}>{from == 'm' ? '素材指导' : from == 'clone' || from == 'cloneV' ? '克隆指导' : '随拍指导'}</View>
            <View>
              <View className={styles.phoneTitle}>正确示例</View>
              <View className={styles.phoneCorrect}>
                <View className={styles.phoneCorrectLeft}>
                  <Image src={from == 'clone' || from == 'cloneV' ? 'https://image.aindecor.co/AInDecorBase/source_data/clone_require/correct.jpg' : "https://image.aindecor.co/AInDecorBase/source_data/material_require/correct.jpg"} className={styles.phoneCorrectLeftImg}></Image>
                </View>
                <View className={styles.phoneCorrectRight}>
                  <View className={styles.phoneCorrectRightBox}>
                    <Passed className={styles.phoneCorrectRightIcon} />
                    <Text>画质清晰（1080p以上）</Text>
                  </View>
                  <View className={styles.phoneCorrectRightBox}>
                    <Passed className={styles.phoneCorrectRightIcon} />
                    <Text>视频长10秒 ~ 60秒</Text>
                  </View>
                  <View className={styles.phoneCorrectRightBox}>
                    <Passed className={styles.phoneCorrectRightIcon} />
                    <Text>匀速移动拍摄不抖动</Text>
                  </View>
                  <View className={styles.phoneCorrectRightBox}>
                    <Passed className={styles.phoneCorrectRightIcon} />
                    <Text>光线色彩适宜不过曝</Text>
                  </View>
                  <View className={styles.phoneCorrectRightBox}>
                    <Passed className={styles.phoneCorrectRightIcon} />
                    <Text>音画同步流畅不卡顿</Text>
                  </View>
                </View>
              </View>
              <View className={styles.phoneTitle}>错误示例</View>
              <View className={styles.phoneTitleError}>
                {
                   listDemoFn().map((item,index)=>{
                    return <View key={index} className={styles.phoneTitleBox}>
                       <Image src={item.url} className={styles.phoneCorrectLittleImg}></Image>
                       <View className={styles.phoneCorrectLittleNav}>
                         <Cross style={{color:"#f00",fontWeight:'bolder'}} />
                         <Text>{item.nav}</Text>
                       </View>
                    </View>
                  })
                }
              </View>
            </View>
          </View>
          <View className={styles.phoneBoxBottom}>
            <Button className={styles.btnOk} onClick={() =>{
              
              if(from == 'clone'){
                handleTakePhoto('local');
              }else if(from == 'cloneV'){
                handleTakeVideo('local');
              } else if(from == 'v'){
                handleTakeVideo('local');
              } else{
                handleChooseMedia()
              }
            } }>
              本地上传
            </Button>
            <Button className={styles.btnOk} onClick={()=>{
              if(from == 'clone'){
                handleTakePhoto();
              }else{
                handleTakeVideo()
              }
            }}>
              在线拍摄
            </Button>
          </View>
        </View>
      </Dialog.Content>
    </Dialog>
  );
};
export default RandomShoot;