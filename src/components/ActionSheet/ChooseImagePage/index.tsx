import Media from '@/components/ViewPort/Media';
import { storeActions, useStoreData } from '@/store';
import { ActionSheet } from '@taroify/core';
import { ScrollView, View } from '@tarojs/components';
import { useAsyncEffect, useMemoizedFn } from 'ahooks';
import classnames from 'classnames';
import { useMemo, useState } from 'react';
import styles from './index.module.scss';
import Taro from '@tarojs/taro';
import uploadFile from '@/lib/request/upload';

type IChooseImagePageProps = {
  visible: boolean;
  handelClose: () => void;
  handelSubmit: (images: Fetch.IImagePage[]) => void;
  type?: 'image' | 'video' | 'all';
};

const ChooseImagePage: React.FC<IChooseImagePageProps> = (props) => {
  const { visible, type = 'image', handelClose, handelSubmit } = props;

  const { chatList, imagePage, imageMarked } = useStoreData(({ common, delivery }) => ({
    chatList: common.chatList,
    imagePage: delivery.imagePage,
    imageMarked: delivery.imageMarked,
  }));

  const [materialId, setMaterialId] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'page' | 'marked'>('page');

  useAsyncEffect(async () => {
    if (visible) {
      await storeActions('GET_IMAGE_PAGE');
      setMaterialId([]);
    }
  }, [visible]);

  const formatImagePage = useMemo(() => {
    let result: Fetch.IQueryImagePageResM = [];
    const checkTypes = type === 'image' ? [0, 1] : type === 'all' ? [0, 1,2,3,4]  :  [2];
    const images = activeTab === 'page' ? imagePage.records : imageMarked;
    for (let i = 0; i < images.length; i++) {
      if (checkTypes.indexOf(images[i].type) != -1) {
        result.push(images[i]);
      }
    }
    return result;
  }, [imagePage, imageMarked, type, activeTab]);

  const handelSwitchTabs = useMemoizedFn((tab: 'page' | 'marked') => {
    switch (tab) {
      case 'page':
        storeActions('GET_IMAGE_PAGE');
        setActiveTab('page');
        break;
      case 'marked':
        storeActions('GET_IMAGE_MARKED');
        setActiveTab('marked');
        break;
      default:
        break;
    }
  });

  const handelUpload = useMemoizedFn(() => {
    Taro.chooseMedia({
      count: 1,
      mediaType: type === 'all' ? ['image', 'video'] : [type],
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
    }).then(async ({ tempFiles }) => {
      Taro.showLoading({ title: '图片上传中',mask:true });
      console.log('tempFiles', tempFiles);
      const { tempFilePath } = tempFiles[0];
      const [result, error] = await uploadFile(
        tempFilePath,
        { conversation_id: chatList[0].id, type: 2 },
        {
          bigFile: type === 'video',
        },
      );
      if (error || !result) return;
      Taro.hideLoading();
      handelSwitchTabs('page');
    });
  });

  const handelItemClick = useMemoizedFn((item) => {
    const findIndex = materialId.findIndex((id) => id === item.id);
    if (findIndex !== -1) {
      materialId.splice(findIndex, 1);
      setMaterialId([...materialId]);
    } else {
      setMaterialId([...materialId, item.id]);
    }
  });

  const handelBtnSubmit = useMemoizedFn(() => {
    const result: Fetch.IImagePage[] = [];
    imagePage.forEach((i) => {
      if (materialId.includes(i.id)) {
        result.push(i);
      }
    });
    handelSubmit(result);
    handelClose();
  });

  return (
    <ActionSheet open={visible} onClose={handelClose}>
      <View className={styles.container}>
        <View className={styles.title}>
          <View className={styles.buttonsList}>
            <View
              className={classnames(styles.buttons, styles.main, { [styles.active]: activeTab === 'page' })}
              onClick={() => handelSwitchTabs('page')}
            >
              历史
            </View>
            {/* <View
              className={classnames(styles.buttons, styles.main, styles.marginLeft, {
                [styles.active]: activeTab === 'marked',
              })}
              onClick={() => handelSwitchTabs('marked')}
            >
              收藏夹
            </View> */}
            <View className={classnames(styles.buttons, styles.submit, styles.marginLeft)} onClick={handelUpload}>
              上传
            </View>
          </View>
          <View className={classnames(styles.buttons, styles.submit)} onClick={handelBtnSubmit}>
            确定
          </View>
        </View>
        <ScrollView scrollY enableFlex className={styles.scrollView}>
          {formatImagePage.map((item) => {
            return (
              <View
                // @ts-ignore
                className={classnames(styles.item, { [styles.active]: materialId.includes(item.id) })}
                onClick={() => handelItemClick(item)}
              >
                <Media media={item}></Media>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </ActionSheet>
  );
};

export default ChooseImagePage;
