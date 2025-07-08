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
import checkIcon from '@/assets/enterprise/check.png';
import styles from './index.module.scss';

definePageConfig({
  navigationBarTitleText: "企业信息", // 会被动态覆盖
  navigationStyle:"default",
  disableScroll: true,
  enableShareAppMessage: true,
  enableShareTimeline: true
});

interface IEnterpriseInfoRes {
    company_name: string;
    contact_phone: string;
    company_address: string;
    category_parent_id: number;
    category_id: number;
    company_description: string;
    main_business: string;
    logo: string
}

const Enterprise = () => {

    const [show, setShow] = useState<boolean>(false);
    const [visable, setVisable] = useState<boolean>(false);
    const [visable1, setVisable1] = useState<boolean>(false);
    const [visable2, setVisable2] = useState<boolean>(false);
    const [isEditInfo, setIsEditInfo] = useState<boolean>(false);
    const [industryEdit, setIndustryEdit] = useState<boolean>(false);
    const [introduce, setIntroduce] = useState<string>('');
    const [industry, setIndustry] = useState<string>('');
    const [business, setBusiness] = useState<string>('');
    const [industryList, setIndustryList] = useState<string[]>(['全屋定制', '家具']);
    const [enterpriseInfo, setEnterpriseInfo] = useState<IEnterpriseInfoRes>({
        company_name: '',
        contact_phone: '',
        company_address: '',
        category_parent_id: 0,
        category_id: 0,
        company_description: '',
        main_business: '',
        logo: ''
    })

    useEffect(()=>{
        onLoadInfo();
    }, []);

    /**
     * 获取企业信息
     */
    const onLoadInfo = () => {
        fetch.queryEnterpriseInfo()
            .then(res=>{
                const [result, error] = res;
                if (error || !result) return;
                console.log('result', result);
                setEnterpriseInfo(result);
            })
    }

    const onLoadCategory = () => {
        fetch.queryCategory()
            .then(res=>{
                const [result, error] = res;
                if (error || !result) return;
                console.log('result', result);
            })
    }

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

    /**
     * 基本信息输入
     * @param type
     * @param event 
     */
    const onChangeVal = (type:string, event:any) => {
        let value = event.detail.value;
        let data = {
            ...enterpriseInfo
        }
        data[type] = value;
        setEnterpriseInfo(data);
    }

    /**
     * 基本信息编辑
     */
    const onEdit = () => {
        if (isEditInfo) {

        } else {
            setIsEditInfo(true);
        }
    }

    return (
        <ScrollView
            scrollY
            className={styles['enterprise_box']}
        >
            <View className={styles['enterprise_box_info']}>
                <Image
                    src={isEditInfo ? checkIcon : editIcon}
                    className={styles['enterprise_box_info_edit']}
                    onClick={()=>{
                        onEdit()
                    }}
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
                <Input
                    className={styles['enterprise_box_info_name']}
                    disabled={isEditInfo}
                    value={enterpriseInfo?.company_name}
                    onInput={(e)=>{onChangeVal('company_name', e)}}
                />
                {/* <View className={styles['enterprise_box_info_name']}>
                    {enterpriseInfo?.company_name || ''}
                </View> */}
                <View className={styles['enterprise_box_info_concat']}>
                    联系方式
                    <Input
                        className={styles['enterprise_box_info_concat_value']}
                        disabled={isEditInfo}
                        value={enterpriseInfo?.contact_phone}
                        onInput={(e)=>{onChangeVal('contact_phone', e)}}
                    />
                    {/* <Text className={styles['enterprise_box_info_concat_value']}>
                        {enterpriseInfo?.contact_phone || ''}
                    </Text> */}
                </View>
                <View className={styles['enterprise_box_info_address']}>
                    地址：
                    <Input
                        className={styles['enterprise_box_info_concat_value']}
                        disabled={isEditInfo}
                        value={enterpriseInfo?.company_address}
                        onInput={(e)=>{onChangeVal('company_address', e)}}
                    />
                    {/* <Text className={styles['enterprise_box_info_address_value']}>
                        {enterpriseInfo?.company_address || ''}
                    </Text> */}
                </View>
            </View>
            <View className={styles['enterprise_box_section']}>
                <View className={styles['enterprise_box_section_title']}>
                    行业类目
                    <Image
                        src={editImg}
                        className={styles['enterprise_box_section_title_icon']}
                        onClick={()=>{
                            setIndustryEdit(true)
                        }}
                    />
                </View>
                <View className={styles['enterprise_box_section_box']}>
                    <View className={styles['enterprise_box_section_box_label']}>所属行业</View>
                    <View className={styles['enterprise_box_section_box_val']}>
                        {enterpriseInfo?.contact_phone || ''}
                    </View>
                </View>
                <View className={styles['enterprise_box_section_box']}>
                    <View className={styles['enterprise_box_section_box_label']}>所属类目</View>
                    <View className={styles['enterprise_box_section_box_val']}>
                        {enterpriseInfo?.contact_phone || ''}
                    </View>
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
                <View>
                    {enterpriseInfo?.company_description || ''}
                </View>
            </View>
            {/* <View className={styles['enterprise_box_section']}>
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
                <View className={styles['enterprise_box_section_item']}>
                    {enterpriseInfo?.main_business || ''}
                </View>
            </View> */}
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
