import fetch from '@/lib/request';
import Taro from '@tarojs/taro';
import Router from '@/lib/router';
// 定义常量(主要用于提示)
const constants = {
  /** 用户信息 */
  GET_USERINFO: 'GET_USERINFO',
  UPDATE_USERINFO: 'UPDATE_USERINFO',
  GET_USER_AUTH: 'GET_USER_AUTH',
  GET_GROUP_ACCOUNT: 'GET_GROUP_ACCOUNT',
  GET_MEMBER_DATA: 'GET_MEMBER_DATA',
  CHANGE_BALANCE_OFF: 'CHANGE_BALANCE_OFF'
} as const;

const user = {
  state: {
    userInfo: {},
    userAuth: [],
    groupAccount: [],
    memberInfo:{},
    balanceOff:false
  } as unknown as StoreState.User,
  actions: {
    [constants.GET_USERINFO]: async ({ setState, getState }: IActionArgs<'user'>) => {
      const {
        user: { userInfo },
      } = getState();
      if (Object.keys(userInfo).length) {
        return userInfo;
      }
      const [result, error] = await fetch.getUserInfo();
      if (!result || error) return;
      setState({ userInfo: result });
      Taro.setStorage({
        key:'is_new',
        data:result.prepare_task_finished ? 'ok' : 'no'
      });
      return result;
    },
    [constants.UPDATE_USERINFO]: ({ setState }: IActionArgs<'user'>, params: StoreState.User['userInfo']) => {
      setState({ userInfo: { ...params } });
    },
    [constants.GET_USER_AUTH]: async ({ setState, getState }: IActionArgs<'user'>) => {
      const {
        user: { userAuth },
      } = getState();
      if (userAuth.length) {
        return userAuth;
      }
      const [result, error] = await fetch.getUserAuth();
      if (!result || error) return;
      setState({ userAuth: result });
      return result;
    },
    [constants.GET_GROUP_ACCOUNT]: async ({ setState }: IActionArgs<'user'>) => {
      const [result, error] = await fetch.getGroupAccount({ size: 500 });
      if (!result || error) return;
      setState({ groupAccount: result });
      return result;
    },
    [constants.GET_MEMBER_DATA]: async ({ setState,getState }: IActionArgs<'user'>) =>  {
      const {
        user: { userInfo },
      } = getState();
      const [result, error] = await fetch.getWalletMember() ;
      if (!result || error) return;
      setState({ memberInfo: result });
      if(result.balance == '0'){// 没有算力其他界面访问不了 
        setState({ balanceOff: true });
        const pages = Taro.getCurrentPages();
        const currentPage = pages[pages.length - 1]; 
        const currentRoute = currentPage.route; 
        if( currentRoute !== "packages/mine/pages/index" && userInfo.prepare_task_finished){
          Router.navigate('LIngInt://mine');
        }
      }
      return result;
    },
    [constants.CHANGE_BALANCE_OFF]: ({ setState }: IActionArgs<'user'>, off:boolean) => {
      setState({ balanceOff: off });
    },
  },
};

export { constants, user };
