import { Image } from '@tarojs/components';
import defaultAvatar from '@/assets/avatar.png';
import styles from '../index.module.scss';
import { useStoreData } from '@/store';

type IAvatar = {
  mode: 'left' | 'right';
};

const Avatar: React.FC<IAvatar> = (props) => {
  const { mode } = props;

  const { userInfo } = useStoreData(({ user }) => ({
    userInfo: user.userInfo,
  }));

  const { dicSetting } = useStoreData(({ common }) => ({
    dicSetting: common.dicSetting
  }));

  return <Image className={styles.avatar} src={mode === 'left' ? dicSetting.length ? dicSetting[0].content.welcome.avatar : defaultAvatar : userInfo.avatar_path}></Image>;
};

export default Avatar;
