import fetch from '@/lib/request';

// 定义常量(主要用于提示)
const constants = {
  /** 获取历史投放记录参数 */
  GET_DELIVER_HISTORY_PARAMS: 'GET_DELIVER_HISTORY_PARAMS',
  /** 获取随机灵感数据 */
  GET_RANDOM_INSPIRE: 'GET_RANDOM_INSPIRE',
  /** 获取已存储的图片和视频 */
  GET_IMAGE_PAGE: 'GET_IMAGE_PAGE',
  /** 获取收藏夹图片和视频 */
  GET_IMAGE_MARKED: 'GET_IMAGE_MARKED',
} as const;

const delivery = {
  state: {
    deliveryList: [{ text: '一键智能投放' }, { text: '自动投放' }],
    worksSourceList: [
      { label: '投放历史', value: '1' },
      { label: '创作灵感', value: '2' },
      // { label: "素材混剪", value: "3" }
    ],
    /** 投放历史数据 */
    deliverHistoryParams: [],
    /** 随机灵感 */
    randomInspire: [],
    imagePage: {
      current: 1,
      records:[],
      size: 72,
      total: 0
    },
    imageMarked: [],
  } as StoreState.Delivery,
  actions: {
    [constants.GET_DELIVER_HISTORY_PARAMS]: async ({ setState }: IActionArgs<'delivery'>, params) => {
      const [result, error] = await fetch.queryDeliverHistoryParams({
        deliver_type: params.type,
        page_size: 10,
      });
      if (error || !result) return;
      setState({ deliverHistoryParams: result });
      return result;
    },
    [constants.GET_RANDOM_INSPIRE]: async ({ setState }: IActionArgs<'delivery'>) => {
      const [result, error] = await fetch.queryRandomInspire({
        size: 4,
      });
      if (error || !result) return;
      setState({ randomInspire: result });
      return result;
    },
    [constants.GET_IMAGE_PAGE]: async ({ getState, setState }: IActionArgs<'delivery'>,
      params: { pageSize?: number; pageNum?: number,image_type?:string } = {}) => {
      const { pageSize = 12, pageNum = 1,image_type = '全部' } = params;
      const {
        delivery:{ imagePage }
      } = getState();
      const [result, error] = await fetch.querySelfMaterialList({
        page_size: pageSize,
        page_num:pageNum,
        image_type
      });
      if (error || !result) return;
      const updatedList = {
        current: result.current,
        size: result.size,
        total: result.total,
        records:pageNum == 1 ? [...result.records  || []] : [...new Map([...(imagePage.records || []),...result.records || []].map(item => [item.id, item])).values()]
      };
      setState({ imagePage: updatedList });
      return updatedList;
    },
    [constants.GET_IMAGE_MARKED]: async ({ getState, setState }: IActionArgs<'delivery'>) => {
      const {
        common: { chatList },
      } = getState();
      if (!chatList.length) return;
      const [result, error] = await fetch.queryImageMarked({
        conversation_id: chatList[0].id,
      });
      if (error || !result) return;
      setState({ imageMarked: result });
      return result;
    },
  },
};

export { constants, delivery };
