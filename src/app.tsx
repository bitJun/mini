import { PropsWithChildren } from 'react';
import { useLaunch } from '@tarojs/taro';
import { Provider } from 'react-redux';
import { store, storeActions } from '@/store';
import Taro from '@tarojs/taro';
import '@nutui/nutui-react-taro/dist/style.css';
// import '@nutui/nutui-react-taro/dist/styles/themes/default.css';
import './app.scss';
import { isLogin } from '@/tools';
const App: React.FC<PropsWithChildren> = ({ children }) => {
  useLaunch(() => {
    // storeActions('GET_DEFAULT_SETTING_NO_LOGIN');
    storeActions('GET_DIC_SETTING');
    storeActions('GET_DEFAULT_SETTING');
    storeActions('GET_USERINFO');
    storeActions('GET_MEMBER_DATA');
    // storeActions('GET_GROUP_ACCOUNT');
    if(isLogin()){
      Taro.getStorage({
        key: 'is_new',
        success: function (res) {
          Taro.switchTab({
            url: '/pages/creation/index' // 你想重新打开的页面，通常是首页
          });
        }
      })   
    }else{
      Taro.setStorage({
        key:'is_new',
        data:'no'
      });
    }
  });

  // children 是将要会渲染的页面
  return <Provider store={store}>{children}</Provider>;
};

export default App;
