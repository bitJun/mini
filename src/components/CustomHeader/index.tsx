import { getStatusBarHeight } from '@/tools';
import { View,Image } from '@tarojs/components';
import { ArrowLeft } from '@taroify/icons';
import classnames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import { useMemoizedFn } from 'ahooks';
import Router from '@/lib/router';
import Taro from '@tarojs/taro';
import useIcon from '@/assets/icon-user-account-circle.png';
import useIconActive from '@/assets/icon-user-account-circle-2.png';
interface CustomHeaderProps {
  title?: string;
  fixed?: boolean;
  titleColor?: string;
  bgType?: 'transparent' | 'white' | 'gray9' | 'gray2' | 'yellow-3c8' | 'gray1' ;
  customBgColor?: 'gray9';
  leftType?: 'home' | 'back' | 'lightBack' | 'city';
  titleType?: 'name' | 'city';
  titleClass?: string;
  scrollLimit?: number;
  leftElement?: React.ReactNode[] | React.ReactNode;
  rightElement?: React.ReactNode[] | React.ReactNode;
  backElement?: React.ReactNode[] | React.ReactNode;
  leftCallback?: () => void;
  zIndex?: string;
}

/**
 * 自定义header头部
 */
const CustomHeader = (props: CustomHeaderProps) => {
  const router = Taro.getCurrentInstance().router;
  const { bgType = 'transparent', leftType, leftElement, fixed = false, zIndex = '400', titleClass = '' } = props;

  const [bgcolor, setBgcolor] = useState<CustomHeaderProps['bgType']>(bgType);

  useEffect(() => setBgcolor(bgType), [bgType]);

  const statusBarHeight = useRef(getStatusBarHeight());

  const handelBack = useMemoizedFn(() => Router.navigateBack());
  const goToMine = useMemoizedFn(() => Router.navigate('LIngInt://mine'));
  return (
    <View
      className={classnames(styles[bgcolor || ''], styles.header, { [styles.fixed]: fixed })}
      style={{ paddingTop: `${statusBarHeight.current}px`, zIndex: zIndex }}
    >
      {/* 背景 */}
      {props.backElement && <View>{props.backElement}</View>}
      <View className={styles.headerPositon}>
        <View className={styles.headerLeft}>
          {leftType ? (
            <>
              {leftType === 'home' && <View onClick={goToMine}>
                <Image className={styles.media} src={router?.path.indexOf('mine') != -1  ? useIconActive : useIcon}></Image>
              </View>}
              {leftType === 'back' && (
                <View className={styles.builtInButton} onClick={handelBack}>
                  <ArrowLeft />
                </View>
              )}
            </>
          ) : leftElement ? (
            <React.Fragment>{leftElement}</React.Fragment>
          ) : null}
        </View>
        {/* title 显示 */}
        <View className={classnames(styles.headerTitle, titleClass)} style={{ color: props.titleColor || 'unset' }}>
          <View>{props.title || ''}</View>
        </View>
        {/* 右侧操作区 - 理论上不与title同时出现 交由业务控制 */}
        {props.rightElement && <View className="pr-70">{props.rightElement}</View>}
        <View className={styles.headerRight} />
      </View>
    </View>
  );
};

export default CustomHeader;
