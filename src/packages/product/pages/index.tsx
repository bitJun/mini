import React, { useEffect, useState, useRef } from 'react';
import Router, { _checkLogin } from '@/lib/router';
import {
  View,
  Text,
  Image,
  ScrollView,
  Input
} from '@tarojs/components';
import fetch from '@/lib/request';
import styles from './index.module.scss';
import SearchIcon from '@/assets/generation/search.png';
import FilterIcon from '@/assets/generation/filter.png';

definePageConfig({
  navigationBarTitleText: "产品库", // 会被动态覆盖
  navigationStyle:"default",
  disableScroll: true,
  enableShareAppMessage: true,
  enableShareTimeline: true
});

interface menuProps {
  name: string;
}

const ProductList = () => {
    const [list, setList] = useState([1,2,3,4,5,6]);
    const page = useRef(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isEmpty, setIsEmpty] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    const [visable, setVisable] = useState<boolean>(false);
    const [visable1, setVisable1] = useState<boolean>(false);
    const [link, setLink] = useState<string>('');

    const menuList: menuProps[] = [
      {
        name: '综合'
      },
      {
        name: '化妆品'
      },
      {
        name: '保健品'
      },
      {
        name: '美白产品'
      },
      {
        name: '祛痘产品'
      },
      {
        name: '保湿产品'
      }
    ]

    useEffect(()=>{
    }, []);

    const onLoadData = () => {
    }

    /**
     * 手动添加
     */
    const onManuallyAdd = () => {

    }

    /**
     * 粘贴链接
     */
    const onPasteLink = () => {
      setVisable1(true)
    }

    return (
      <View className={styles['product_box']} onClick={()=>{setShow(false)}}>
        <View className={styles['product_box_header']}>
          <View className={styles['product_box_header_search']}>
            <Image
              src={SearchIcon}
              className={styles['product_box_header_search_icon']}
            />
            <Input
              className={styles['product_box_header_search_input']}
              placeholder='告诉我，你想寻找什么...'
              placeholderClass={styles['placeholder']}
            />
          </View>
          <View className={styles['product_box_header_filter']} onClick={(e)=>{e.stopPropagation();setShow(true)}}>
            <Image
              src={FilterIcon}
              className={styles['product_box_header_filter_icon']}
            />
            {
              show &&
              <View
                className={styles['product_box_header_filter_menu']}
              >
                {
                  menuList.map((item: menuProps, index: number) =>
                    <View
                      className={styles['product_box_header_filter_menu_item']}
                      onClick={(e)=>{e.stopPropagation();setShow(false)}}
                      key={index}
                    >
                      {item.name}
                    </View>
                  )
                }
              </View>
            }
          </View>
        </View>
        <ScrollView
          scrollY
          className={styles['product_box_main']}
        >
          <View className={styles['product_box_main_info']}>
            {
              list.map((item:any)=>
                <View
                  className={styles['product_box_main_section']}
                  key={item}
                >
                  <View className={styles['product_box_main_section_tag']}>化妆品</View>
                  <Image
                    src={'https://gips3.baidu.com/it/u=4216096237,1736217090&fm=3026&app=3026&size=r3,4&q=75&n=0&g=4n&f=JPEG&fmt=auto&maxorilen2heic=2000000?s=F2B054CF4662875B50904D2203008041'}
                    className={styles['product_box_main_section_img']}
                    mode='aspectFill'
                  />
                  <View className={styles['product_box_main_section_container']}>
                    <View className={styles['product_box_main_section_container_name']}>能量提神臻享抹茶胶囊 · Joy系列</View>
                    <View className={styles['product_box_main_section_container_info']}>
                      <View className={styles['product_box_main_section_container_info_item']}>#护肤品</View>
                      <View className={styles['product_box_main_section_container_info_item']}>#高倍防晒</View>
                    </View>
                  </View>
                </View>
              )
            }
          </View>
          <View
            className={styles['product_box_main_add']}
            onClick={()=>{
              setVisable(true)
            }}
          >
            添加产品
          </View>
        </ScrollView>
        {
          visable &&
          <View
            className={styles['mask']}
            onClick={()=>{
              setVisable(false)
            }}
          >
            <View className={styles['photo_action']}>
              <View
                className={styles['photo_action_item']}
                onClick={()=>{
                  onManuallyAdd()
                }}
              >
                手动添加
              </View>
              <View
                className={styles['photo_action_item']}
                onClick={()=>{
                  onPasteLink()
                }}
              >
                粘贴链接
              </View>
              <View
                className={styles['photo_action_item']}
                onClick={()=>{
                  setVisable(false);
                }}
              >
                取消
              </View>
            </View>
          </View>
        }
        {
          visable1 &&
          <View 
            className={styles['mask']}
            onClick={()=>{
              setVisable1(false);
            }}
          >
            <View
              className={styles['enterprise_introduce']}
              onClick={(e)=>{e.stopPropagation()}}
            >
              <View className={styles['enterprise_introduce_info']}>
                <Input
                  className={styles['enterprise_introduce_info_val']}
                  placeholder='请在此处粘贴1688/淘宝商品链接'
                  placeholderClass={styles['placeholder']}
                  value={link}
                  onInput={(e)=>{
                    setLink(e.detail.value)
                  }}
                />
              </View>
              <View className={styles['enterprise_introduce_action']}>
                <View
                  className={`${styles['enterprise_introduce_action_item']} ${styles['cancel']}`}
                  onClick={()=>{
                    setVisable1(false);
                  }}
                >
                  取消
                </View>
                <View
                  className={`${styles['enterprise_introduce_action_item']} ${styles['sure']}`}
                >
                  确定
                </View>
              </View>
            </View>
          </View>
        }
      </View>
    )
}

export default ProductList;
