import React, { useEffect, useState, useRef } from 'react';
import Router, { _checkLogin } from '@/lib/router';
import Taro from '@tarojs/taro';
import {
  View,
  Text,
  Image,
  ScrollView,
  RichText,
  Input,
  Textarea
} from '@tarojs/components';
import fetch from '@/lib/request';
import editIcon from '@/assets/enterprise/eidtIcon.png';
import editImg from '@/assets/enterprise/edit.png';
import photoIcon from '@/assets/enterprise/photo.png';
import removeIcon from '@/assets/enterprise/remove.png';
import addIcon from '@/assets/enterprise/add.png';
import styles from './index.module.scss';

definePageConfig({
  navigationBarTitleText: "企业信息", // 会被动态覆盖
  navigationStyle:"default",
  disableScroll: true,
  enableShareAppMessage: true,
  enableShareTimeline: true
});

const Enterprise = () => {

    const [show, setShow] = useState<boolean>(false);
    const [visable, setVisable] = useState<boolean>(false);
    const [visable1, setVisable1] = useState<boolean>(false);
    const [visable2, setVisable2] = useState<boolean>(false);
    const [industryEdit, setIndustryEdit] = useState<boolean>(false);
    const [introduce, setIntroduce] = useState<string>('');
    const [industry, setIndustry] = useState<string>('');
    const [business, setBusiness] = useState<string>('');
    const [industryList, setIndustryList] = useState<string[]>(['全屋定制', '家具']);

    useEffect(()=>{

    }, []);

    /**
     * 点击企业logo
     */
    const onPhotoLogo = () => {
        setShow(true);
    }

    /**
     * 头像上传
     * @param type 
     */
    const onPhoto = (type: 'album' | 'camera') => {
        Taro.chooseImage({
            sourceType: [type],
            count: 1,
            success: function() {

            }
        })
    }

    return (
        <ScrollView
            scrollY
            className={styles['enterprise_box']}
        >
            <View className={styles['enterprise_box_info']}>
                <Image
                    src={editIcon}
                    className={styles['enterprise_box_info_edit']}
                />
                <View
                    className={styles['enterprise_box_info_logo']}
                    onClick={()=>{onPhotoLogo()}}
                >
                    <Image
                        src={editIcon}
                        className={styles['enterprise_box_info_logo_img']}
                    />
                    <Image
                        src={photoIcon}
                        className={styles['enterprise_box_info_logo_icon']}
                    />
                </View>
                <View className={styles['enterprise_box_info_name']}>
                    AlnDlm
                </View>
                <View className={styles['enterprise_box_info_concat']}>
                    联系方式
                    <Text className={styles['enterprise_box_info_concat_value']}>(684) 555-0102</Text>
                </View>
                <View className={styles['enterprise_box_info_address']}>
                    地址：
                    <Text className={styles['enterprise_box_info_address_value']}>北京市朝阳区星地中心B座</Text>
                </View>
            </View>
            <View className={styles['enterprise_box_section']}>
                <View className={styles['enterprise_box_section_title']}>
                    所属行业
                    <Image
                        src={editImg}
                        className={styles['enterprise_box_section_title_icon']}
                        onClick={()=>{
                            setIndustryEdit(true)
                        }}
                    />
                </View>
                <View className={styles['enterprise_box_section_tags']}>
                    {
                        industryList && industryList.map((item: string, index: number)=>
                            <View
                                className={styles['enterprise_box_section_tags_item']}
                                key={index}
                            >
                                {item}
                                {
                                    industryEdit &&
                                    <Image
                                        src={removeIcon}
                                        className={styles['enterprise_box_section_tags_item_icon']}
                                    />
                                }
                            </View>
                        )
                    }
                    {
                        industryEdit &&
                        <Image
                            src={addIcon}
                            className={styles['enterprise_box_section_tags_add']}
                            onClick={()=>{
                                setVisable1(true)
                            }}
                        />
                    }
                </View>
            </View>
            <View className={styles['enterprise_box_section']}>
                <View className={styles['enterprise_box_section_title']}>
                    公司简介
                    <Image
                        src={editImg}
                        className={styles['enterprise_box_section_title_icon']}
                        onClick={()=>{
                            setVisable(true)
                        }}
                    />
                </View>
            </View>
            <View className={styles['enterprise_box_section']}>
                <View className={styles['enterprise_box_section_title']}>
                    主营业务
                    <Image
                        src={editImg}
                        className={styles['enterprise_box_section_title_icon']}
                        onClick={()=>{
                            setVisable2(true)
                        }}
                    />
                </View>
                <View className={styles['enterprise_box_section_item']}>门窗定制</View>
            </View>
            <View className={styles['enterprise_box_tip']}>
                更多个人信息可以到PC端进行配置～
            </View>
            {
                show &&
                <View
                    className={styles['mask']}
                    onClick={()=>{
                        setShow(false)
                    }}
                >
                    <View className={styles['photo_action']}>
                        <View
                            className={styles['photo_action_item']}
                            onClick={()=>{
                                onPhoto('album')
                            }}
                        >
                            本地上传
                        </View>
                        <View
                            className={styles['photo_action_item']}
                            onClick={()=>{
                                onPhoto('camera')
                            }}
                        >
                            立即拍摄
                        </View>
                        <View
                            className={styles['photo_action_item']}
                            onClick={()=>{
                                setShow(false);
                            }}
                        >
                            取消
                        </View>
                    </View>
                </View>
            }
            {
                visable &&
                <View 
                    className={styles['mask']}
                    onClick={()=>{
                        setVisable(false);
                    }}
                >
                    <View
                        className={styles['enterprise_introduce']}
                        onClick={(e)=>{e.stopPropagation()}}
                    >
                        <View className={styles['enterprise_introduce_title']}>公司简介</View>
                        <View className={styles['enterprise_introduce_info']}>
                            <Textarea
                                className={styles['enterprise_introduce_info_val']}
                                value={introduce}
                                onInput={(e)=>{
                                    setIntroduce(e.detail.value)
                                }}
                            />
                        </View>
                        <View className={styles['enterprise_introduce_action']}>
                            <View
                                className={`${styles['enterprise_introduce_action_item']} ${styles['cancel']}`}
                                onClick={()=>{
                                    setVisable(false);
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
            {
                visable1 &&
                <View
                    className={styles['mask']}
                    onClick={()=>{
                        setVisable1(false);
                    }}
                >
                    <View
                        className={styles['enterprise_industry']}
                        onClick={(e)=>{e.stopPropagation()}}
                    >
                        <View className={styles['enterprise_industry_title']}>添加行业</View>
                        <View className={styles['enterprise_industry_box']}>
                            <Input
                                className={styles['enterprise_industry_box_val']}
                                value={industry}
                                onInput={(e)=>{
                                    setIndustry(e.detail.value)
                                }}
                            />
                        </View>
                        <View className={styles['enterprise_industry_action']}>
                            <View
                                className={`${styles['enterprise_industry_action_item']} ${styles['cancel']}`}
                                onClick={()=>{
                                    setVisable1(false);
                                }}
                            >
                                取消
                            </View>
                            <View
                                className={`${styles['enterprise_industry_action_item']} ${styles['sure']}`}
                            >
                                确定
                            </View>
                        </View>
                    </View>
                </View>
            }
            {
                visable2 &&
                <View
                    className={styles['mask']}
                    onClick={()=>{
                        setVisable2(false);
                    }}
                >
                    <View
                        className={styles['enterprise_business']}
                        onClick={(e)=>{e.stopPropagation()}}
                    >
                        <View className={styles['enterprise_business_title']}>主营业务</View>
                        <View className={styles['enterprise_business_box']}>
                            <Input
                                className={styles['enterprise_business_box_val']}
                                value={business}
                                onInput={(e)=>{
                                    setBusiness(e.detail.value)
                                }}
                            />
                        </View>
                        <View className={styles['enterprise_business_action']}>
                            <View
                                className={`${styles['enterprise_business_action_item']} ${styles['cancel']}`}
                                onClick={()=>{
                                    setVisable2(false);
                                }}
                            >
                                取消
                            </View>
                            <View
                                className={`${styles['enterprise_business_action_item']} ${styles['sure']}`}
                            >
                                确定
                            </View>
                        </View>
                    </View>
                </View>
            }
        </ScrollView>
    )
}

export default Enterprise;
