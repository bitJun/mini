import React, { useEffect, useState, useRef } from 'react';
import Router, { _checkLogin } from '@/lib/router';
import { useRouter } from '@tarojs/taro';
import {
  View,
  Text,
  Image,
  ScrollView
} from '@tarojs/components';
import fetch from '@/lib/request';
import styles from './index.module.scss';

interface ICustomerMsgItem {
    private_msg_id: number;
    content: string;
    publish_time: string;
    is_from_user: number;
}

const msgDetail = () => {
    type IRouterData = {id: string};

    const { id } = Router.getData() as IRouterData;
    const [list, setList] = useState([]);
    const page = useRef(1);
    const [conversationId, setConversationId] = useState<string>('');

    useEffect(()=>{
        console.log('id', id);
        setConversationId(id);
    }, []);

    useEffect(()=>{
        if (conversationId) {
            onLoadData();
        }
    }, [conversationId])

    const onLoadData = () => {
        let params = {
            conversation_id: conversationId,
            page_num: page.current,
            page_size: 10
        }
        fetch.deliveryCustomerMsg(params)
            .then(res=>{
                const [result, error] = res;
                if (error || !result) return;
                console.log('result', result);
            })
    }

    return (
        <View className={styles['msg_box']}>
            <ScrollView
                scrollY
                className={styles['msg_box_main']}
            >
123
            </ScrollView>
        </View>
    )
}

export default msgDetail;