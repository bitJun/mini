import { getSystemInfoSync } from '@tarojs/taro';
import fetch from '@/lib/request';
import Taro from '@tarojs/taro';
import { console } from 'inspector';

// 定义常量(主要用于提示)
const constants = {
  GET_SYSTEM_INFO: 'GET_SYSTEM_INFO',
  GET_DEFAULT_SETTING: 'GET_DEFAULT_SETTING',
  GET_DIC_SETTING: 'GET_DIC_SETTING',
  GET_DEFAULT_SETTING_NO_LOGIN: 'GET_DEFAULT_SETTING_NO_LOGIN',
  GET_CHAT_LIST: 'GET_CHAT_LIST',
  GET_DELIVER_CUSTOMER_CONVERSATION: 'GET_DELIVER_CUSTOMER_CONVERSATION',
  GET_SUPPORT: 'GET_SUPPORT',
  GET_TASK: 'GET_TASK',
  GET_TOPIC: 'GET_TOPIC',
  GET_HOT:'GET_HOT',
  GET_WORK:'GET_WORK',
  GET_TODO:'GET_TODO',
  RESET_STATE_S:'RESET_STATE_S',
  GET_LINE:'GET_LINE',
  RESET_STATE:'RESET_STATE',
  TOGGLE_SELECTED:'TOGGLE_SELECTED'
} as const;

const common = {
  state: {
    systemInfo: getSystemInfoSync(),
    globalLoading: false,
    chatLoading: false,
    defaultSetting: {},
    dicSetting: [],
    defaultSettingNoLogin: {},
    chatList: [],
    customerList:{
      records:[]
    },
    supportList:{
      items:[]
    },
    taskList:[],
    hotList:{
      current: 1,
      records:[],
      size: 72,
      total: 0
    },
    workList:{
      current: 1,
      records:[],
      size: 12,
      total: 0
    },
    lineList:{
      current: 1,
      records:[],
      size: 12,
      total: 0
    },
    todoList:[],
  } as StoreState.Common,
  actions: {
    [constants.GET_DEFAULT_SETTING_NO_LOGIN]: async ({ setState, getState }: IActionArgs<'common'>) => {
      const {
        common: { defaultSettingNoLogin },
      } = getState();
      if (Object.keys(defaultSettingNoLogin).length) {
        return defaultSettingNoLogin;
      }
      const [result, error] = await fetch.getDefaultSettingMini();
      if (!result || error) return;
      setState({ defaultSettingNoLogin: result });
      return result;
    },
    [constants.GET_DEFAULT_SETTING]: async ({ setState, getState }: IActionArgs<'common'>) => {
      const {
        common: { defaultSetting },
      } = getState();
      if (Object.keys(defaultSetting).length) {
        return defaultSetting;
      }
      const [result, error] = await fetch.getDefaultSetting();
      if (!result || error) return;
      setState({ defaultSetting: result });
      return result;
    },
    [constants.GET_DIC_SETTING]: async ({ setState, getState }: IActionArgs<'common'>) => {
      const {
        common: { dicSetting },
      } = getState();
      if (Object.keys(dicSetting).length) {
        return dicSetting;
      }
      const [result, error] = await fetch.queryDictConfig();
      if (!result || error) return;
      setState({ dicSetting: result });
      return result;
    },
    [constants.GET_CHAT_LIST]: async ({ setState }: IActionArgs<'common'>) => {
      const [result, error] = await fetch.queryChatList({ need_last_msg: true });
      if (!result || error) return;
      setState({ chatList: result });
      return result;
    },
    [constants.GET_DELIVER_CUSTOMER_CONVERSATION]: async ({ setState,getState }: IActionArgs<'common'>) => {
      const [result, error] = await fetch.getDeliverCustomerConversion({ page_size:127,page_num:1 });
      if (!result || error) return;
      const {
        common: { defaultSetting },
      } = getState();
      const { deliver_platform } = defaultSetting;
      const mixedArr: any[] = [];
      const records = result.records;
      for (let i = 0; i < records.length; i++) {
        const obj: any = {};
        obj.id =  records[i].id;
        obj.name = records[i].platform_account.nick_name;
        obj.user_avatar = records[i].platform_account.user_avatar;
        obj.last_msg =  records[i].latest_clue_content;
        obj.last_msg_create_time =  records[i].latest_clue_time;
        obj.platform = records[i].deliver_account.platform
        if(deliver_platform){
          const findPlatform = deliver_platform.find((o) => records[i].deliver_account.platform === o.chineseName);
          if (findPlatform) {
            obj.image = findPlatform.url
          }
        }else{
          obj.image = ''
        }
        mixedArr.push(obj);
      }
      setState({ customerList: {
        records:mixedArr
      } });
      return result;
    },
    [constants.GET_SUPPORT]: async ({ setState }: IActionArgs<'common'>) => {
      const [result, error] = await fetch.getSupport();
      if (!result || error) return;
      setState({ supportList: result });
      return result;
    },
    [constants.GET_TASK]: async ({ setState }: IActionArgs<'common'>) => {
      const [result, error] = await fetch.getNotice();
      if (!result || error) return;
      setState({ taskList: result });
      return result;
    },
    [constants.GET_HOT]: async ({ setState,getState }: IActionArgs<'common'>,
      params: { pageSize?: number; pageNum?: number } = {}
    ) => {
      const { pageSize = 8, pageNum = 1 } = params;
      const [result, error] = await fetch.getHots({
        page_size:pageSize,
        page_num:pageNum
      });
      if (!result || error) return;
      const {
        common: { hotList }
      } = getState();
      const updatedList = {
        current: result.current,
        size: result.size,
        total: result.total,
        records:pageNum == 1 ? [...result.records] : [...new Map([...(hotList.records || []),...result.records].map(item => [item.id, item])).values()]
      };
      setState({ hotList: updatedList });
      return updatedList;
    },
    [constants.GET_WORK]: async ({ setState,getState }: IActionArgs<'common'>,
      params: { pageSize?: number; pageNum?: number } = {}
    ) => {
      const { pageSize = 12, pageNum = 1 } = params;
      const [result, error] = await fetch.getWorks({
        page_size: pageSize,
        page_num:pageNum
      });
      if (!result || error) return;
      const {
        common: { workList }
      } = getState();
      const updatedList = {
        current: result.current,
        size: result.size,
        total: result.total,
        records:[...new Map([...(workList.records || []), ...result.records].map(item => [item.id, item])).values()]
      };
      setState({ workList: updatedList });
      return result;
    },
    [constants.GET_TODO]: async ({ setState }: IActionArgs<'common'>) => {
      const [result, error] = await fetch.getTodos();
      if (!result || error) return;
      setState({ todoList: result });
      if(result.length){
        Taro.setTabBarBadge({
          index: 2,
          text: result.length + '',
        });
      }
      return result;
    },
    [constants.GET_LINE]: async ({ setState,getState }: IActionArgs<'common'>,
      params: { pageSize?: number; pageNum?: number } = {}) => {
      const { pageSize = 12, pageNum = 1 } = params;
      const [result, error] = await fetch.getLines({
        page_size: pageSize,
        page_num:pageNum
      });
      if (!result || error) return;
      const {
        common: { lineList }
      } = getState();
      const updatedList = {
        current: result.current,
        size: result.size,
        total: result.total,
        records:[...new Map([...(lineList.records || []), ...result.records].map(item => [item.id, item])).values()]
      };
      setState({ lineList: updatedList });
      return result;
    },
    [constants.RESET_STATE]: async ({ setState }: IActionArgs<'common'>) => {
      setState({ 
        globalLoading: false,
        chatLoading: false,
        defaultSetting: {},
        dicSetting: [],
        defaultSettingNoLogin: {},
        chatList: [],
        customerList:{
          records:[]
        },
        supportList:{
          items:[]
        },
        taskList:[],
        hotList:{
          current: 1,
          records:[],
          size: 72,
          total: 0
        },
        workList:{
          current: 1,
          records:[],
          size: 12,
          total: 0
        },
        lineList:{
          current: 1,
          records:[],
          size: 12,
          total: 0
        },
        todoList:[]
      });
    },
    [constants.RESET_STATE_S]: async ({ setState }: IActionArgs<'common'>) => {
      setState({ 
        workList:{
          current: 1,
          records:[],
          size: 12,
          total: 0
        }
      });
    },
    [constants.TOGGLE_SELECTED]: ({ setState,getState },params: {hotId: number }
    ) => {
      const { hotId } = params;
      const {
        common: { hotList }
      } = getState();
      let newD = JSON.parse(JSON.stringify(hotList))
      newD.records = newD.records.map((item) =>
        item.id === hotId
          ? { ...item, selected: !item.selected }
          : item
      )
      setState({hotList:newD});
    },
  },
};

export { constants, common };
