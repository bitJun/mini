import React, { useEffect, useState, useRef } from 'react';
import Router, { _checkLogin } from '@/lib/router';
import {
  View,
  Text,
  Image,
  ScrollView,
  Input
} from '@tarojs/components';
import Taro from '@tarojs/taro';
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

interface ProductItem {
  id: number;
  category: number;
  color: string;
  description: string;
  item_type: string;
  material: string;
  name: string;
  price: string;
  property: string;
  size: string;
  label: string[];
  images: {
    http_img_path: string;
    id: number;
    img_path: string;
  }[];
  item_url: { commission: string; display_mode: string; platform: string; url: string }[];
  save_vector_status:number,
  selected?: boolean
}

const ProductList = () => {
    const [list, setList] = useState<Array<ProductItem>>([]);
    const page = useRef(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isEmpty, setIsEmpty] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    const [visable, setVisable] = useState<boolean>(false);
    const [visable1, setVisable1] = useState<boolean>(false);
    const [link, setLink] = useState<string>('');
    const [flag, setFlag] = useState<boolean>(true);

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
      onLoadData();
    }, []);

    const onLoadData = () => {
      let params = {
        page_num: page.current,
        page_size: 10,
        search_text: '',
        fetch_all: false
      }
      fetch.queryProductList(params)
        .then(res=>{
          const [result, error] = res;
          if (error || !result) return;
          let arr:any = [];
          if (page.current == 1) {
            arr = result.records;
          } else {
            arr = [...list, ...result.records];
          }
          setList(arr);
          result.records.length < 10 ? setHasMore(false) : setHasMore(true);
          page.current == 1 && result.records.length == 0 ? setIsEmpty(true) : setIsEmpty(false);
        })
    }

    /**
     * 手动添加
     */
    const onManuallyAdd = () => {
      Router.navigate('LIngInt://productPublish');
    }

    /**
     * 粘贴链接
     */
    const onPasteLink = () => {
      setVisable1(true)
    }

    const onShowDetail = (id) => {
      Router.navigate('LIngInt://productDetail',{ data: { id: id } });
    }

    const onAddLink = () => {
      if (!link) {
        Taro.showToast({
          title: '请输入链接',
          icon: 'none'
        });
        return;
      }
      if (flag) {
        setFlag(false);
        fetch.postProductThirdUrl({url: link})
          .then(res=>{
            const [result, error] = res;
            if (error || !result) return;
            console.log('result', result);
            Taro.showToast({
              title: '添加成功',
              icon: 'none'
            });
            page.current = 1;
            onLoadData();
            setVisable1(false);
            setLink('');
            setFlag(true);
          })
      }
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
              list.map((item:ProductItem, index: number)=>
                <View
                  className={styles['product_box_main_section']}
                  key={item.id * index}
                  onClick={()=>{
                    onShowDetail(item?.id)
                  }}
                >
                  <View className={styles['product_box_main_section_tag']}>化妆品</View>
                  <Image
                    src={item?.images?.[0]?.http_img_path || ''}
                    className={styles['product_box_main_section_img']}
                    mode='aspectFill'
                  />
                  <View className={styles['product_box_main_section_container']}>
                    <View className={styles['product_box_main_section_container_name']}>{item?.name || ''}</View>
                    <View className={styles['product_box_main_section_container_info']}>
                      {
                        item?.label && item?.label.map((label: string, key: number) =>
                          <View 
                            className={styles['product_box_main_section_container_info_item']}
                            key={key}
                          >
                            #{label}
                          </View>
                        )
                      }
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
                    setLink('');
                    setVisable1(false);
                  }}
                >
                  取消
                </View>
                <View
                  className={`${styles['enterprise_introduce_action_item']} ${styles['sure']}`}
                  onClick={()=>{
                    onAddLink()
                  }}
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
