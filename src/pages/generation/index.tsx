import { useEffect, useState } from 'react';
import useShareMessage from '@/hooks/useShareMessage';
import { _checkLogin } from '@/lib/router';
import {
  View,
  Image,
  Input,
  Text,
  ScrollView
} from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import {
  assetsItem
} from './type';
import styles from './index.module.scss';
import Arrow1 from '@/assets/generation/arrow1.png';
import Arrow2 from '@/assets/generation/arrow2.png';
import Arrow3 from '@/assets/generation/arrow3.png';
import Arrow4 from '@/assets/generation/arrow4.png';
import Icon1 from '@/assets/generation/icon1.png';
import Icon2 from '@/assets/generation/icon2.png';
import Icon3 from '@/assets/generation/icon3.png';
import Icon4 from '@/assets/generation/icon4.png';
import DigitalMan from '@/assets/generation/digital_man.png';
import RanageIcon from '@/assets/generation/ranage.png';
import ProductIcon from '@/assets/generation/product.png';
import ShebeiIcon from '@/assets/generation/shebei.png';
import SucaiIcon from '@/assets/generation/sucai.png';
import ZhishikuIcon from '@/assets/generation/zhishiku.png';
import SearchIcon from '@/assets/generation/search.png';
import ClearIcon from '@/assets/generation/clear.png';
import EmptyIcon from '@/assets/generation/empty.png';


definePageConfig({
  navigationBarTitleText: "营销发展员工", // 会被动态覆盖
  navigationStyle:"default",
  disableScroll: true,
  enableShareAppMessage: true,
  enableShareTimeline: true
});

const Generation = () => {

  const [keyword, setKeyword] = useState<string>('');
  const [tags, setTags] = useState<Array<string>>(['产品推广', '流量密码', '直播行业', '内容讲解', '方法论']);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const assetsList:Array<assetsItem> = [
    {
      id: 1,
      icon: Icon1,
      name: '产品库',
      desc: '产品详情、图片样例！企业产品资产，点进来，查就行～',
      bg: ProductIcon,
      color: '#53B7EE',
      arrow: Arrow1,
    },
    {
      id: 2,
      icon: Icon2,
      name: '素材库',
      desc: '营销物料、品牌素材～ 企业素材资产，都在这，直接拿！',
      bg: SucaiIcon,
      color: '#F38BCE',
      arrow: Arrow2,
    },
    {
      id: 3,
      icon: Icon3,
      name: '知识库',
      desc: '笔记文章、企业资料！企业知识资产，记录成长的事儿～',
      bg: ZhishikuIcon,
      color: '#FFCA7E',
      arrow: Arrow3,
    },
    {
      id: 4,
      icon: Icon4,
      name: '设备库',
      desc: '企业硬件设备资产，工作状态一眼明，直接操作超方便！',
      bg: ShebeiIcon,
      color: '#9C8FF3',
      arrow: Arrow4,
    },
  ]

  useShareMessage();
  useDidShow(() => {
    _checkLogin();
  });

  /**
   * keyword输入事件
   * @param e
   */
  const onChange = (e: any) => {
    setKeyword(e.detail.value);
  };

  /**
   * keyword清除事件
   */
  const onClear = () => {
    setKeyword('');
  };

  return (
    <View className={styles.generation}>
      <View className={styles['generation_digital']}>
        <Image
          src={DigitalMan}
          className={styles['generation_digital_img']}
        />
        <View className={styles['generation_digital_main']}>
          <View className={styles['generation_digital_main_title']}>Hey，Maleah!</View>
          <View className={styles['generation_digital_main_desc']}>👇 这里帮您管理了您的企业数字资产！</View>
        </View>
        <Image
          src={RanageIcon}
          className={styles['generation_digital_icon']}
        />
      </View>
      <View className={styles['generation_box']}>
        <Image
          src={SearchIcon}
          className={styles['generation_box_icon']}
        />
        <Input
          className={styles['generation_box_search']}
          placeholder='告诉我，你想寻找什么...'
          value={keyword}
          onInput={(e)=>{onChange(e)}}
          placeholderClass={styles.placeholder}
        />
        {
          keyword ? (
            <Image
              src={ClearIcon}
              className={styles['generation_box_clear']}
              onClick={()=>{onClear()}}
            />
          ) : null
        }
      </View>
      <ScrollView
        className={styles['generation_tags']}
        scrollX
      >
        {
          tags && tags.map((item: string, index: number) =>
            <View
              className={styles['generation_tags_item']}
              key={index}
            >
              {item}
            </View>
          )
        }
      </ScrollView>
      {
        keyword ? (
          <View className={styles['generation_section']}>
            {
              isEmpty ? (
                <View className={styles['generation_section_empty']}>
                  <Image
                    src={EmptyIcon}
                    className={styles['generation_section_empty_img']}
                  />
                  <Text className={styles['generation_section_empty_text']}>抱歉！暂无搜索结果</Text>
                </View>
              ) : (
                <View className={styles['generation_section_main']}></View>
              )
            }
          </View>
        ) : (
          <View className={styles['generation_digitalAssets']}>
            <View className={styles['generation_digitalAssets_title']}>
              数字资产
              <Text className={styles['generation_digitalAssets_title_time']}>更新于2025.06.16</Text>
            </View>
            <View className={styles['generation_digitalAssets_container']}>
              {
                assetsList.map((item: assetsItem, index: number) =>
                  <View
                    className={styles['generation_digitalAssets_container_section']}
                    key={index}
                    style={{
                      backgroundColor: item.color,
                    }}
                  >
                    <Image
                      src={item.arrow}
                      className={styles['generation_digitalAssets_container_section_icon']}
                    />
                    <View
                      className={styles['generation_digitalAssets_container_section_box']}
                      style={{
                        backgroundImage: `url(${item.bg})`,
                        backgroundSize: 'cover',
                      }}
                    >
                      <View
                        className={styles['generation_digitalAssets_container_section_box_icon']}
                        style={{
                          backgroundColor: item.color,
                        }}
                      >
                        <Image
                          src={item.icon}
                          className={styles['generation_digitalAssets_container_section_box_icon_img']}
                        />
                      </View>
                      <View className={styles['generation_digitalAssets_container_section_box_title']}>
                        {item.name}
                      </View>
                      <View className={styles['generation_digitalAssets_container_section_box_desc']}>
                        {item.desc}
                      </View>
                    </View>
                  </View>
                )
              }
            </View>
          </View>
        )
      }
    </View>
  );
};

export default Generation;
