import React, { useEffect, useState, useRef } from 'react';
import Router, { _checkLogin } from '@/lib/router';
import Taro from '@tarojs/taro';
import {
  View,
  Text,
  Image,
  ScrollView
} from '@tarojs/components';
import {
  formatTimeBefore
} from '@/tools/time';
import styles from './index.module.scss';
import fetch from '@/lib/request';
import filiterIcon from '@/assets/developcustomer/filter.png';
import ClueEmptyIcon from '@/assets/developcustomer/clue_empty.png';
import MsgEmptyIcon from '@/assets/developcustomer/msg_empty.png';
import employeeEmpty from '@/assets/developcustomer/employee_empty.png';
import msgEmpty from '@/assets/developcustomer/msg_empty.png';
import weiboIcon from '@/assets/developcustomer/weibo.png';
import xhsIcon from '@/assets/developcustomer/xiaohongshu.png';
import douyinIcon from '@/assets/developcustomer/douyin.png';

interface EmployeeItem {
  account_id: string;
  account_unique_id: string;
  nickname: string;
  avatar: string;
  unread: number;
  platform: number
}

type IDeliverCustomerMessageItemUser = {
  account_id: string;
  account_unique_id: string;
  nickname: string;
  avatar: string;
  ip_location: string;
}
type IDeliverCustomerMessageItemWork = {
  work_id: number;
  unique_id: string;
  work_type: number;
  cover: string;
}
type IDeliverCustomerMessageItemMy = {
  account_id: string;
  account_unique_id: string;
  nickname: string;
  avatar: string;
  ip_location: string;
}

interface msgItem {
  message_id: string | number;
  message_type: string | number;
  original_id: string | number;
  platform: number;
  content: string;
  publish_time: string;
  user: IDeliverCustomerMessageItemUser;
  work: IDeliverCustomerMessageItemWork;
  my: IDeliverCustomerMessageItemMy;
}

interface clueUserItem {
  account_id: string;
  account_unique_id: string;
  avatar: string;
  ip_location: string;
  nickname: string;
}

interface clueItem {
  clue_id: number;
  clue_time: string;
  contact: string;
  platform: number;
  user: clueUserItem
}

interface noticeItem {
  id: number;
  noticeTitle: string;
  noticeDesc: string;
  descValue: string;
  noticeType: number;
  readFlag: number;
  createTime: string;
}

definePageConfig({
  navigationBarTitleText: "营销发展员工", // 会被动态覆盖
  navigationStyle:"default",
  disableScroll: true,
  enableShareAppMessage: true,
  enableShareTimeline: true
});

const platformIcon = {
  1: xhsIcon,
  2: douyinIcon,
  3: weiboIcon
}

const DevelopCustomer = () => {
  const [type, setType] = useState<string>('msg');
  const [msgList, setMsgList] = useState<any[]>([]);
  const [msgEmpty, setMsgEmpty] = useState<boolean>(false);
  const [clueList, setClueList] = useState<any[]>([]);
  const [clueEmpty, setClueEmpty] = useState<boolean>(false);
  const [noticeList, setNoticeList] = useState<any[]>([]);
  const [noticeEmpty, setNoticeEmpty] = useState<boolean>(false);
  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const [employeeId, setEmployeeId] = useState<string>('');
  const [show, setShow] = useState<boolean>(false);
  const msgPage = useRef<number>(1);
  const cluePage = useRef<number>(1);
  const noticePage = useRef<number>(1);
  const [hasMoreMsg, setHasMoreMsg] = useState<boolean>(true);
  const [hasMoreClue, setHasMoreClue] = useState<boolean>(true);
  const [hasMoreNotice, setHasMoreNotice] = useState<boolean>(true);
  const employeePage = useRef<number>(1);

  useEffect(()=>{
    onLoadEmployee();
  }, []);

  useEffect(()=>{
    if (type == 'msg' && employeeId) {
      onLoadMsgList()
    }
    if (type == 'clue') {
      onLoadClueList()
    }
    if (type == 'notice') {
      onLoadNotiiceList();
    }
  }, [type, employeeId]);

  const onLoadClueList = () => {
    let params = {
      page_size: 10,
      page_num: cluePage.current
    }
    fetch.deliverCustomerMsgClue(params)
      .then(res=>{
        console.log('res', res);
        const [result, error] = res;
        if (error || !result) return;
        let arr:any = [];
        if (cluePage.current == 1) {
          arr = result.records;
        } else {
          arr = [...clueList, result.records];
        }
        result.records.length < 10 ? setHasMoreClue(false) : setHasMoreClue(true);
        cluePage.current == 1 && result.records.length == 0 ? setClueEmpty(true) : setClueEmpty(false);
        setClueList(arr);
      })
  }

  const onLoadNotiiceList = () => {
    let params = {
      page_num: noticePage.current
    }
    fetch.deliveryNoticeList(params)
      .then(res=>{
        const [result, error] = res;
        if (error || !result) return;
        let arr:any = [];
        if (noticePage.current == 1) {
          arr = result.records;
        } else {
          arr = [...noticeList, result.records];
        }
        result.records.length < 10 ? setHasMoreNotice(false) : setHasMoreNotice(true);
        noticePage.current == 1 && result.records.length == 0 ? setNoticeEmpty(true) : setNoticeEmpty(false);
        setNoticeList(arr);
      });
  }

  /**
   * 加载智能员工
   */
  const onLoadEmployee = () => {
    let params = {
      page_size: 10,
      page_num: employeePage.current
    }
    fetch.deliverCustomerMsgEmployee(params)
      .then(res=>{
        const [result, error] = res;
        if (error || !result) return;
        console.log('employeePage', res);
        console.log('result', result);
        setEmployeeList(result.records);
      });
  }

  const onLoadMsgList = () => {
    let params = {
      account_id: employeeId,
      page_num: msgPage.current,
      page_size: 10,
    }
    fetch.deliverCustomerMsgMessage(params)
      .then(res=>{
        const [result, error] = res;
        if (error || !result) return;
        let arr:any = [];
        if (msgPage.current == 1) {
          arr = result.records;
        } else {
          arr = [...msgList, ...result.records];
        }
        setMsgList(arr);
        result.records.length < 10 ? setHasMoreMsg(false) : setHasMoreMsg(true);
        msgPage.current == 1 && result.records.length == 0 ? setMsgEmpty(true) : setMsgEmpty(false);
        console.log('employeePage', res);
        console.log('result', result);
      })
  }

  /**
   * tab切换事件
   * @param key
   */
  const onChangeType = (key: string) => {
    setType(key);
  }

  const onChangeEmployee = (id: string) => {
    setEmployeeId(id);
  }

  const onRenderMsg = () => {
    return (
      <View className={styles['employee_box']}>
        {
          employeeList && employeeList.length > 0 ? (
            <View className={styles['employee_box_section']}>
              {
                employeeList.map((item:EmployeeItem, index:number)=>
                  <View
                    className={styles['employee_box_section_main']}
                    key={Number(item.account_unique_id) * index}
                    onClick={()=>{
                      onChangeEmployee(item.account_id)
                    }}
                  >
                    <View className={styles['employee_box_section_main_info']}>
                      {
                        item.unread == 1 &&
                        <View className={styles['employee_box_section_main_info_dot']}></View>
                      }
                      <Image
                        src={item.avatar}
                        className={`${styles['employee_box_section_main_info_img']} ${item.account_id == employeeId ? `${styles['active']}` : ''}`}
                      />
                      {
                        item.platform &&
                        <Image
                          src={platformIcon[item.platform]}
                          className={styles['employee_box_section_main_info_icon']}
                        />
                      }
                    </View>
                    <View className={styles['employee_box_section_main_name']}>{item.nickname}</View>
                  </View>
                )
              }
            </View>
          ) : (
            onRenderEmptyEmployee()
          )
        }
        {
          msgEmpty ? (
            onRenderMsgEmpty()
          ) : (
            <ScrollView
              scrollY={true}
              style={{
                height: `calc(100% - 128rpx)`
              }}
            >
              {
                msgList.map((item: msgItem) =>
                  <View 
                    className={styles['employee_box_item']}
                    key={item.message_id}
                    onClick={()=>{
                      console.log(123)
                      Router.navigate('LIngInt://msgDetail',{ data: { id: item.message_id } });
                    }}
                  >
                    <Image
                      src={item.my.avatar}
                      className={styles['employee_box_item_img']}
                    />
                    <View className={styles['employee_box_item_main']}>
                      <View className={styles['employee_box_item_main_info']}>
                        <View className={styles['employee_box_item_main_info_left']}>
                          <Text className={styles['employee_box_item_main_info_user']}>{item.user.nickname}</Text>
                          {item.message_type == 1 ? '私信了你' : '回复了你的评论'}
                        </View>
                        <View></View>
                      </View>
                      <View className={styles['employee_box_item_main_content']}>{item.content}</View>
                    </View>
                  </View>
                )
              }
            </ScrollView>
          )
        }
      </View>
    )
  }

  const onRenderEmptyEmployee = () => {
    return (
      <View className={styles['employee_box_emptys']}>
        <Image
          src={employeeEmpty}
          className={styles['employee_box_emptys_img']}
        />
        <View className={styles['employee_box_emptys_tip']}>暂无消息</View>
        <View className={styles['employee_box_emptys_tips']}>购买设备！发布作品后</View>
        <View className={styles['employee_box_emptys_tips']}>会把客户消息聚到这儿，等你互动～</View>
        <View className={styles['employee_box_emptys_guide']}>工作指南</View>
      </View>
    ) 
  }

  const onRenderMsgEmpty = () => {
    return (
      <View className={styles['employee_box_empty']}>
        <Image
          src={MsgEmptyIcon}
          className={styles['employee_box_empty_img']}
        />
        <Text className={styles['employee_box_empty_tip']}>暂无互动消息</Text>
      </View>
    )
  }

  const onRenderClueUserInfo = (info) => {
    if (info) {
      let data = JSON.parse(info);
      return (
        <View>
          {
            data.map((item:any, index: number) =>
              <View className={styles['clue_box_main_section_contact']} key={index}>
                {item.type}：{item.number}
              </View>
            )
          }
        </View>
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
        <View>
          {
            clueList.map((item: clueItem) => 
              <View
                className={styles['clue_box']}
                key={item.clue_id}
              >
                <View className={styles['clue_box_tag']}>A级</View>
                <View className={styles['clue_box_main']}>
                  <Image
                    src={item.user.avatar}
                    className={styles['clue_box_main_img']}
                  />
                  <View className={styles['clue_box_main_section']}>
                    <View className={styles['clue_box_main_section_info']}>
                      <Image
                        src={platformIcon[item.platform]}
                        className={styles['clue_box_main_section_info_icon']}
                      />
                      {item.user.nickname}
                    </View>
                    {
                      item.contact && onRenderClueUserInfo(item.contact)
                    }
                  </View>
                </View>
                <View className={styles['clue_box_location']}>{item.user.ip_location}</View>
                <View className={styles['clue_box_contact']}>联系</View>
              </View>
            )
          }
        </View>
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
        <View
          className={styles['notice_view']}
        >
          {
            noticeList.map((item:noticeItem, index: number)=>{
              let time = new Date(item.createTime).getTime();
              return (
                <View
                  className={styles['notice_view_box']}
                  key={item.id}
                >
                  <View className={styles['notice_view_box_main']}>
                    {
                      item.noticeTitle &&
                      <View className={styles['notice_view_box_main_title']}>{item.noticeTitle}</View>
                    }
                    <View className={styles['notice_view_box_main_content']}>{item.noticeDesc}</View>
                  </View>
                  <View className={styles['notice_view_box_time']}>{formatTimeBefore(time)}</View>
                </View>
              )
            })
          }          
        </View>
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
              height: `calc(100vh - 128rpx)`,
              marginTop: '48rpx'
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
              height: `calc(100% - 128rpx)`,
              marginTop: '48rpx'
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
