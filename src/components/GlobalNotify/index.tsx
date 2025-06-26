import React, { useEffect, useState } from 'react';
import { Notify } from '@taroify/core';
import Taro from '@tarojs/taro';
// import { View } from '@tarojs/components';
// import { Volume } from "@taroify/icons";
// import styles from './index.module.scss';
type IChooseImagePageProps = {
 type?:string;
};
const GlobalNotify: React.FC<IChooseImagePageProps> = (props) => {
  const { type = '' } = props;
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    // 监听全局事件来触发通知
    const showNotification = (event) => {
      setMessage(event.message);
      setVisible(true);
      setTimeout(() => setVisible(false), 2700); // 自动关闭通知
    };

    // 监听自定义事件
    Taro.eventCenter.on('show_notify', showNotification);

    // 清理事件监听
    return () => {
      Taro.eventCenter.off('show_notify', showNotification);
    };
  }, []);

  return (
    <>
      <Notify 
        duration={1000}
        open={visible} 
        color="success" 
        style={{
          height:'64px',
          position: 'fixed',
          top: type && type == 'top' ? 0 : 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999, // 确保层级高于摄像头按钮等元素
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {message}
      </Notify>
    </>
  );
};

export default GlobalNotify;