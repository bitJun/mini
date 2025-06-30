import React, { useEffect, useState, useRef } from 'react';
import Router, { _checkLogin } from '@/lib/router';
import {
  View,
  Text,
  Image,
  ScrollView
} from '@tarojs/components';
import styles from './index.module.scss';
import fetch from '@/lib/request';
import filiterIcon from '@/assets/developcustomer/filter.png';
import ClueEmptyIcon from '@/assets/developcustomer/clue_empty.png';

definePageConfig({
  navigationBarTitleText: "营销发展员工", // 会被动态覆盖
  navigationStyle:"default",
  disableScroll: true,
  enableShareAppMessage: true,
  enableShareTimeline: true
});

const DevelopCustomer = () => {
  const [type, setType] = useState<string>('msg');
  const [msgList, setMsgList] = useState<any[]>([]);
  const [msgEmpty, setMsgEmpty] = useState<boolean>(false);
  const [clueList, setClueList] = useState<any[]>([]);
  const [clueEmpty, setClueEmpty] = useState<boolean>(true);
  const [noticeList, setNoticeList] = useState<any[]>([]);
  const [noticeEmpty, setNoticeEmpty] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const msgPage = useRef<number>(1);
  const cluePage = useRef<number>(1);
  const noticePage = useRef<number>(1);
  const employeePage = useRef<number>(1);

  useEffect(()=>{
    onLoadEmployee();
  }, []);

  useEffect(()=>{
    if (type == 'msg') {
      onLoadMsgList()
    }
    if (type == 'clue') {
      onLoadClueList()
    }
    if (type == 'notice') {
      onLoadNotiiceList();
    }
  }, [type]);

  const onLoadClueList = () => {
    let params = {
      page_size: 10,
      page_num: cluePage.current
    }
    fetch.deliverCustomerMsgClue(params)
      .then(res=>{
        console.log('res', res);
      })
  }

  const onLoadNotiiceList = () => {

  }

  const onLoadEmployee = () => {
    let params = {
      page_size: 10,
      page_num: employeePage.current
    }
    fetch.deliverCustomerMsgEmployee(params)
      .then(res=>{
        console.log('employeePage', res);
      });
  }

  const onLoadMsgList = () => {

  }

  /**
   * tab切换事件
   * @param key
   */
  const onChangeType = (key: string) => {
    setType(key);
  }

  const onRenderMsg = () => {
    if (msgEmpty) {
      return (
        <View></View>
      )
    }
    else {
      return (
        <View></View>
      )
    }
  }
  const onRenderClue = () => {
    if (clueEmpty) {
      return (
        <View className={styles['clue_empty']}>
          <Image
            src={ClueEmptyIcon}
            className={styles['clue_empty_img']}
          />
          <View className={styles['clue_empty_tip']}>暂无线索</View>
          <View className={styles['clue_empty_tips']}>发布作品！挂载组件后</View>
          <View className={styles['clue_empty_tips']}>Amy会把客户留资整理在这儿，等你对接～</View>
          <View className={styles['clue_empty_guide']}>工作指南</View>
        </View>
      )
    }
    else {
      return (
        <View></View>
      )
    }
  }
  const onRenderNotice = () => {
    if (noticeEmpty) {
      return (
        <View></View>
      )
    }
    else {
      return (
        <View></View>
      )
    }
  }

  return (
    <View
      className={styles.container}
      onClick={()=>{
        setShow(false);
      }}
    >
      <View className={styles['container_tabs']}>
        <View
          className={`${styles['container_tabs_item']} ${type == 'msg' ? `${styles.active}` : ''}`}
          onClick={()=>{onChangeType('msg')}}
        >
          消息
        </View>
        <View
          className={`${styles['container_tabs_item']} ${type == 'clue' ? `${styles.active}` : ''}`}
          onClick={()=>{onChangeType('clue')}}
        >
          线索
        </View>
        <View
          className={`${styles['container_tabs_item']} ${type == 'notice' ? `${styles.active}` : ''}`}
          onClick={()=>{onChangeType('notice')}}
        >
          通知
        </View>
        {
          type == 'clue' ? (
            <View
              className={styles['container_tabs_filiter']}
              onClick={(e)=>{
                e.stopPropagation();
                setShow(true);
              }}
            >
              <Image
                src={filiterIcon}
                className={styles['container_tabs_filiter_icon']}
              />
              {
                show ? (
                  <View
                    className={styles['container_tabs_filiter_menu']}
                    onClick={(e)=>{
                      e.stopPropagation();
                    }}
                  >
                    <View
                      className={styles['container_tabs_filiter_menu_item']}
                      onClick={(e)=>{
                        e.stopPropagation();
                        setShow(false);
                      }}
                    >
                      全部
                    </View>
                    <View
                      className={styles['container_tabs_filiter_menu_item']}
                      onClick={(e)=>{
                        e.stopPropagation();
                        setShow(false);
                      }}
                    >
                      S级
                    </View>
                    <View
                      className={styles['container_tabs_filiter_menu_item']}
                      onClick={(e)=>{
                        e.stopPropagation();
                        setShow(false);
                      }}
                    >
                      A级
                    </View>
                    <View
                      className={styles['container_tabs_filiter_menu_item']}
                      onClick={(e)=>{
                        e.stopPropagation();
                        setShow(false);
                      }}
                    >
                      B级
                    </View>
                  </View>
                ) : null
              }
            </View>
          ) : null
        }
      </View>
      {
        type == 'msg' ? (
          <View>
            {onRenderMsg()}
          </View>
        ) : null
      }
      {
        type == 'clue' ? (
          <ScrollView
            style={{
              height: `calc(100% - 128rpx)`
            }}
            scrollY={true}
          >
            {onRenderClue()}
          </ScrollView>
        ) : null
      }
      {
        type == 'notice' ? (
          <ScrollView
            style={{
              height: `calc(100% - 128rpx)`
            }}
            scrollY={true}
          >
            {onRenderNotice()}
          </ScrollView>
        ) : null
      }
    </View>
  );
};

export default DevelopCustomer;
