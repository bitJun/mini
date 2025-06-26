import { storeActions, useStoreData } from '@/store';
import { useAsyncEffect } from 'ahooks';

const useImageInject = () => {
  const { userAuth } = useStoreData(({ user }) => ({
    userAuth: user.userAuth,
  }));

  // useAsyncEffect(async () => {
  //   await storeActions('GET_USER_AUTH');
  // }, []);

  const formatWatermark = (src) => {
    return src;
    if (userAuth && userAuth.length) {
      if (userAuth[0].enable && userAuth[0].auth_type == 'watermark' && src.indexOf('.gif') == -1) {
        // 统一处理 src，例如添加基础路径
        if (src.indexOf('?x-oss-') == -1) {
          return `${src}${userAuth[0].info}`;
        } else {
          return src;
        }
      } else {
        return src;
      }
    } else {
      return src;
    }
  };

  return { formatWatermark };
};

export default useImageInject;
