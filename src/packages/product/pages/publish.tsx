import React, { useEffect, useState, useRef } from 'react';
import Router, { _checkLogin } from '@/lib/router';
import {
  View,
  Text,
  Image,
  ScrollView,
  Input,
  Swiper,
  SwiperItem
} from '@tarojs/components';
import fetch from '@/lib/request';
import styles from './publish.module.scss';
import SearchIcon from '@/assets/generation/search.png';
import FilterIcon from '@/assets/generation/filter.png';

definePageConfig({
  navigationBarTitleText: "产品库", // 会被动态覆盖
  navigationStyle:"default",
  disableScroll: true,
  enableShareAppMessage: true,
  enableShareTimeline: true
});

const productPublish = () => {
  return (
    <View className={styles['product_publish']}>
      <ScrollView
        className={styles['product_publish_main']}
        scrollY={true}
      >

      </ScrollView>
      <View className={styles['product_publish_action']}>
        <View
          className={`${styles['product_publish_action_item']} ${styles['cancel']}`}
        >
          取消
        </View>
        <View
          className={`${styles['product_publish_action_item']} ${styles['sure']}`}
        >
          保存并返回
        </View>
      </View>
    </View>
  )
}

export default productPublish();