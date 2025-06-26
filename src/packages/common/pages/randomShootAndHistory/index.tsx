import { View,Image,Text,Button,ScrollView } from '@tarojs/components';
import { useMemoizedFn,useAsyncEffect } from 'ahooks';
import { storeActions, useStoreData } from '@/store';
import { useState,useCallback, useRef } from 'react';
import styles from './index.module.scss';
import Taro from '@tarojs/taro';
import fetch from '@/lib/request';
import logo from '@/assets/logo-light.png';
import { Passed,Cross,Play } from "@taroify/icons";
import { Dialog,Image as ImageMy } from "@taroify/core";
import uploadFile from '@/lib/request/upload';
import useImageInject from '@/hooks/useImageInject';
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
type IProps = {
  from:string;
  maId:number;
  showDia:boolean;
  setShowDia:(a:boolean) => void;
  reflexData:(images?:[]) => void;
};
const RandomShootAndHistory :React.FC<IProps> = (props) => {
  const { showDia,setShowDia,maId,reflexData,from} = props;
  const [valueRadio, setValueRadio] = useState(0);
  const [materialId, setMaterialId] = useState<number[]>([]);
  const { formatWatermark } = useImageInject();
  useAsyncEffect(async () => {
    if (showDia) {
      await storeActions('GET_IMAGE_PAGE',{
        pageSize: 12, 
        pageNum:1,
        image_type:from == 'v' ? '视频' : from == 'img' ? '图片' : '全部'
      });
      setMaterialId([]);
    }
  }, [showDia]);
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
        if(from == 'm' || from == 'img'){
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
        if(from == 'm' || from == 'img'){
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
        if(from == 'm' || from == 'v'){
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
    return listDemo
  }
  const duleRadio = (val)=>{
    setValueRadio(val)
  }
  const radioVal = [
    {
      name:'素材库',
      val:0
    },
    {
      name:'本地素材',
      val:1
    }
  ]
  const {imagePage } = useStoreData(({ delivery }) => ({
    imagePage: delivery.imagePage,
  }));
  const handelItemClick = useMemoizedFn((item) => {
    const findIndex = materialId.findIndex((id) => id === item.id);
    if (findIndex !== -1) {
      materialId.splice(findIndex, 1);
      setMaterialId([...materialId]);
    } else {
      setMaterialId([...materialId, item.id]);
    }
  });
  const [loading, setLoading] = useState(false);
  const loadMore = async () => {
    if(loading)return;
    setLoading(true);
    if(valueRadio === 0){
      let pageN = imagePage.current + 1;
      if(imagePage.total == imagePage.records.length){
        setLoading(false);
        return;
      }
      await storeActions('GET_IMAGE_PAGE',{
        pageSize: 12, 
        pageNum:pageN,
        image_type:from == 'v' ? '视频' : from == 'img' ? '图片' : '全部'
      });
    }
    setLoading(false);
  };
  const handleScrollLower = () => {
    loadMore();
  };
  const handelBtnSubmit = useMemoizedFn(() => {
    const result: Fetch.IQuerySelfMaterialRes['records'] = [];
    imagePage.records.forEach((i) => {
      if (materialId.includes(i.id)) {
        result.push(i);
      }
    });
    reflexData(result as unknown as []);
  });
  /** 图片预览 */
  const previewImage = useMemoizedFn((url) => {
    Taro.previewImage({
      current: url,
      urls: [url],
    });
  });
  const tapTimer = useRef<number | null>(null) 
  const lastTapTime = useRef(0)
  const handleTap = useCallback((item) => {
    const now = Date.now()
    const DOUBLE_TAP_DELAY = 300 // 双击间隔设为300ms
    // 清除之前的单击定时器（如果是第二次点击）
    if (tapTimer.current) {
      clearTimeout(tapTimer.current)
      tapTimer.current = null
    }
    // 判断是否是双击
    if (now - lastTapTime.current < DOUBLE_TAP_DELAY) {
      // 双击事件
      handleDoubleClick(item)
      lastTapTime.current = 0;
    } else {
      // 可能是单击，设置定时器等待可能的第二次点击
      lastTapTime.current = now
      tapTimer.current = setTimeout(() => {
        // 定时器触发表示没有第二次点击，执行单击
        handleSingleClick(item)
        tapTimer.current = null
      }, DOUBLE_TAP_DELAY) as unknown as number;
    }
  }, [])
   // 单击处理函数
   const handleSingleClick = (item) => {
    console.log('单击事件')
    Taro.vibrateShort({ type: 'light' }) // 轻震动反馈
    // 这里添加你的单击逻辑
    handelItemClick(item)
  }
  
  // 双击处理函数
  const handleDoubleClick = (item) => {
    console.log('双击事件')
    Taro.vibrateShort() // 标准震动反馈
    // 这里添加你的双击逻辑
    if(item.type == 2){
        
    }else{
      previewImage(item.http_img_path);
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
            <View className={styles.phoneBoxTitle}>
              添加素材
            </View>
          </View>
        </View>
       <View className={styles.workBottomBoxRadio}>
          {
            radioVal.map((item)=>{
              return <View className={classnames(styles.workBottomBoxRadioC,{[styles.active]: valueRadio === item.val })} key={item.val} onClick={()=>duleRadio(item.val)}>{item.name}</View>
            })
          }
        </View>
        {
           valueRadio == 0 ? <View>
            <ScrollView scrollY enableFlex className={styles.scrollView} onScrollToLower={handleScrollLower}>
              {imagePage.records.map((item) => {
                return (
                  <View
                    // @ts-ignore
                    className={classnames(styles.item, { [styles.active]: materialId.includes(item.id) })}
                    onClick={(e) => {
                      e.stopPropagation();
                      handelItemClick(item)
                    }}
                  >
                    {
                      item.type == 2 ? <ImageMy className={styles.media} placeholder="加载中..." src={formatWatermark(item.head_img_path)} lazyLoad	={true} mode='aspectFill'></ImageMy> :  <ImageMy className={styles.media} placeholder="加载中..." src={formatWatermark(item.http_img_path)} lazyLoad	={true} mode='aspectFill'></ImageMy>
                    }
                    {
                      item.type == 2 ? <Play  className={styles.iconS} /> : null
                    }
                  </View>
                );
              })}
            </ScrollView> 
            <View className={classnames(styles.phoneBoxBottom,styles.phoneBoxBottomCenter)}>
              <Button className={styles.btnOk} onClick={handelBtnSubmit}>
                确定
              </Button>
            </View>
           </View> : null
        }
        {
          valueRadio == 1 ? 
          <View>
            <View className={styles.phoneBoxTop}>
              <View>
                <View className={styles.phoneTitle}>正确示例</View>
                <View className={styles.phoneCorrect}>
                  <View className={styles.phoneCorrectLeft}>
                    <Image src={from == 'img' ? 'https://image.aindecor.co/AInDecorBase/source_data/clone_require/correct.jpg' : "https://image.aindecor.co/AInDecorBase/source_data/material_require/correct.jpg"} className={styles.phoneCorrectLeftImg}></Image>
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
                
                if(from == 'img'){
                  handleTakePhoto('local');
                } else if(from == 'v'){
                  handleTakeVideo('local');
                } else{
                  handleChooseMedia()
                }
              } }>
                本地上传
              </Button>
              <Button className={styles.btnOk} onClick={()=>{
                if(from == 'img'){
                  handleTakePhoto();
                }else{
                  handleTakeVideo()
                }
              }}>
                在线拍摄
              </Button>
            </View>
          </View> : null
        }
      </Dialog.Content>
    </Dialog>
  );
};
export default RandomShootAndHistory;