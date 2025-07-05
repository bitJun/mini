import React, { useEffect, useState, useRef } from 'react';
import Router, { _checkLogin } from '@/lib/router';
import {
  View,
  Image,
  ScrollView,
  RichText
} from '@tarojs/components';
import fetch from '@/lib/request';
import styles from './index.module.scss';

interface ICustomerMsgItem {
    private_msg_id: number;
    content: string;
    publish_time: string;
    is_from_user: number;
}

const Materials = () => {
    type IRouterData = {
        id: string;
        myAvatar: string;
        userAvatar: string;
    };

    const { id, myAvatar, userAvatar } = Router.getData() as IRouterData;
    const [list, setList] = useState([]);
    const page = useRef(1);
    const [conversationId, setConversationId] = useState<string>('');
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isEmpty, setIsEmpty] = useState<boolean>(false);

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

    const isJSON = (str) => {
        if (typeof str !== 'string') {
        return false;
        }
        try {
        const result = JSON.parse(str);
        return typeof result === 'object' && result !== null;
        } catch (e) {
        return false;
        }
    }

    return (
        <View className={styles['msg_box']}>
            <ScrollView
                scrollY
                className={styles['msg_box_main']}
            >
                {
                    list && list.map((item: ICustomerMsgItem, index: number) => {
                        let msg = '';
                        if (isJSON(item.content)) {
                            msg = JSON.parse(item.content).text;
                        } else {
                            msg = item.content;
                        }
                        return (
                            <View
                                className={`${styles['msg_box_item']} ${item.is_from_user == 2 ? `${styles['reverse']}` : ''}`}
                            >
                                <Image
                                    src={item.is_from_user == 1 ? myAvatar : userAvatar}
                                    className={styles['msg_box_item_avatar']}
                                />
                                <View className={styles['msg_box_item_main']}>
                                    {
                                        isJSON(item.content) ? (
                                            <RichText
                                                className={styles['msg_box_item_main_content']}
                                                nodes={msg}
                                            />
                                        ) : (
                                            <View className={styles['msg_box_item_main_content']}>{msg}</View>
                                        )
                                    }
                                </View>
                            </View>
                        )
                    })
                }
            </ScrollView>
        </View>
    )
}

export default Materials;