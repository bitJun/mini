import Router from '@/lib/router';
import { WebView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useRouter } from '@tarojs/taro';
import { useEffect, useState } from 'react';

const Webview = () => {
  const { params } = useRouter();
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    if (!params.url) {
      Taro.showToast({ title: '参数错误', icon: 'none' });
      setTimeout(() => {
        Router.navigateBack();
      }, 1500);
      return;
    }
    setUrl(decodeURIComponent(params.url));
  }, []);

  return url ? <WebView src={url} /> : null;
};

export default Webview;
