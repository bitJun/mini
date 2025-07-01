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

const Msg = () => {
    const route = useRouter();
    const [list, setList] = useState([]);
    const page = useRef(1);
    const [conversationId, setConversationId] = useState<number>();

    useEffect(()=>{
        let id = route.params.id;
        console.log('id', id, route.params)
        console.log('Router', Router.getData())
        // setConversationId(id);
        onLoadData();
    }, []);

    const onLoadData = () => {

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

export default Msg;