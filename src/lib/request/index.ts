import { delivery } from '@/store/modules/delivery';
import request, { IRequestOptions } from './request';

const fetch = {
  /** 获取短信验证码 */
  getSms: (params: Fetch.IGetSmsParams) =>
    request<Fetch.ICommonRes>({
      method: 'POST',
      url: '/sms',
      params,
    } as IRequestOptions),
  /** 手机号登录 */
  phoneLogin: (params: Fetch.IPhoneLoginParams) =>
    request<Fetch.ILoginRes>({
      method: 'POST',
      url: '/user/phone-login',
      params,
      version:'LINGYING'
    } as IRequestOptions),
  /** 微信登录 */
  preLogin: (params: Fetch.IPreLoginParams) =>
    request<Fetch.IPreLoginRes>({
      method: 'POST',
      url: '/wx-mini/pre-login',
      params,
      version:'LINGYING'
    } as IRequestOptions),
  /** 手机号一键登录 */
  login: (params: Fetch.ILoginParams) =>
    request<Fetch.ILoginRes>({
      method: 'POST',
      url: '/wx-mini/login',
      params,
      version:'LINGYING'
    } as IRequestOptions),
  /** 查询账号安全信息 */
  getSecurity: () =>
    request<Fetch.IGetSecurityRes>({
      method: 'GET',
      url: '/user/security',
    } as IRequestOptions),
  /** 创建对话 */
  createChat: (params: Fetch.ICreateChatParams) =>
    request<Fetch.ICommonRes>({
      method: 'POST',
      url: '/conversation',
      params,
    } as IRequestOptions),
  /** 查询对话列表 */
  queryChatList: (params: { need_last_msg?: boolean }) =>
    request<Fetch.IQueryChatListRes>({
      method: 'GET',
      url: '/conversation',
      params,
    } as IRequestOptions),
  /** 查询对话列表 */
  deleteChat: (params: { id: number }) =>
    request<Fetch.ICommonRes>({
      method: 'DELETE',
      url: '/conversation',
      params,
    } as IRequestOptions),
  /** 查询消息列表 */
  queryMessageList: (params: Fetch.IQueryMessageListParams) =>
    request<Fetch.IQueryMessageListRes>({
      method: 'GET',
      url: '/message',
      params,
    } as IRequestOptions),
  /** 获取用户基本信息 */
  getUserInfo: () =>
    request<Fetch.IGetUserInfoRes>({
      method: 'GET',
      url: '/user',
      forceLogin: false,
    } as IRequestOptions),
  /** 更新用户信息 */
  updateUserInfo: (params: Fetch.IUpdateUserInfoParams) =>
    request<Fetch.IGetUserInfoRes>({
      method: 'PUT',
      url: '/user',
      params,
    } as IRequestOptions),
  /** 更新用户头像 */
  updateUserAvatar: (params: Fetch.IUpdateUserAvatarParams) =>
    request<Fetch.IGetUserInfoRes>({
      method: 'PUT',
      url: '/user/avatar',
      params,
    } as IRequestOptions),
  /** 更新用户手机号 */
  updateUserPhone: (params: Fetch.IUpdateUserPhoneParams) =>
    request<Fetch.IGetUserInfoRes>({
      method: 'PUT',
      url: '/user/phone',
      params,
    } as IRequestOptions),
  /** 用户会员权限 */
  getUserAuth: () =>
    request<Fetch.IGetUserAuthRes>({
      method: 'GET',
      url: '/user/auth',
      forceLogin: false,
    } as IRequestOptions),
  /** 上传图片 */
  putImageUpload: (params: Fetch.IPutImageUploadParams) =>
    request<Fetch.IPutImageUploadRes>({
      method: 'POST',
      url: '/img/upload',
      params,
    } as IRequestOptions),
  /** 获取账号列表  */
  getAccount: (params: Fetch.IGetAccountParams) =>
    request<Fetch.IGetAccountRes>({
      method: 'GET',
      url: '/deliver/account',
      params,
    } as IRequestOptions),
  /** 获取账号组列表 */
  getDeliverGroup: (params: { fetch_all: boolean }) =>
    request<Fetch.IGetDeliverGroupRes>({
      method: 'GET',
      url: '/deliver-group',
      params,
    } as IRequestOptions),
  /** 新增账号组 */
  addDeliverGroup: (params: { name: string }) =>
    request<Fetch.ICommonRes>({
      method: 'POST',
      url: '/deliver-group',
      params,
    } as IRequestOptions),
  /** 编辑账号组 */
  editDeliverGroup: (params: { id: number; name: string }) =>
    request<Fetch.ICommonRes>({
      method: 'PUT',
      url: '/deliver-group',
      params,
    } as IRequestOptions),
  /** 删除账号组 */
  deleteDeliverGroup: (params: { id: number }) =>
    request<Fetch.ICommonRes>({
      method: 'DELETE',
      url: '/deliver-group',
      params,
    } as IRequestOptions),
  /** 查询账号组内账号 */
  getDeliverGroupAccount: (params: { group_id: number }) =>
    request<Fetch.IGetDeliverGroupAccountRes>({
      method: 'GET',
      url: '/deliver-group/account',
      params,
    } as IRequestOptions),
  /** 更新账号组内账号 */
  updateDeliverGroupAccount: (params: { group_id: number; account_ids: number[] }) =>
    request<Fetch.ICommonRes>({
      method: 'PUT',
      url: '/deliver-group/account',
      params,
    } as IRequestOptions),
  /** 获取账号分组列表 */
  getGroupAccount: (params: Fetch.IGetGroupAccountParams) =>
    request<Fetch.IGetGroupAccountRes>({
      method: 'GET',
      url: '/deliver/group-account',
      params,
      forceLogin: false,
    } as IRequestOptions),
  /** 账号登录态检测 */
  checkStatusAccount: (params: Fetch.ICheckStatusAccountParams) =>
    request<Fetch.ICheckStatusAccountRes>({
      method: 'GET',
      url: '/deliver/check-status',
      params,
    } as IRequestOptions),
  /** 获取微信绑定二维码 */
  getWxBindQrCode: () =>
    request<Fetch.IGetWxBindQrCodeRes>({
      method: 'GET',
      url: '/wx/qrcode',
    } as IRequestOptions),
  /** 查询微信绑定状态  */
  getWxBindStatus: (params: { key: string }) =>
    request<Fetch.IGetCreateQrCodeRes>({
      method: 'POST',
      url: '/user/wx-bind',
      params,
      ignoreError: true,
    } as IRequestOptions),
  /** 获取登录二维码 */
  getCreateQrCode: (params: Fetch.IGetCreateQrCodeParams) =>
    request<Fetch.IGetCreateQrCodeRes>({
      method: 'POST',
      url: '/deliver/create-qrcode',
      params,
    } as IRequestOptions),
  /** 关闭登录二维码 */
  quitCreateQrCode: (params: Fetch.IQuitCreateQrCodeParams) =>
    request<Fetch.ICommonRes>({
      method: 'POST',
      url: '/deliver/quit',
      params,
    } as IRequestOptions),
  /** 获取登录状态 */
  getLoginQrCode: (params: Fetch.IGetLoginQrCodeParams) =>
    request<Fetch.IGetLoginQrCodeRes>({
      method: 'POST',
      url: '/deliver/qrcode-login',
      params,
      ignoreError: true,
    } as IRequestOptions),
  /** 退出登录 */
  logoutAccount: (params: Fetch.ILogoutAccountParams) =>
    request<Fetch.ICommonRes>({
      method: 'POST',
      url: '/deliver/logout',
      params,
      isUrlParams: true,
    } as IRequestOptions),
  /** 随机获取创作灵感 */
  queryRandomInspire: (params: Fetch.IQueryRandomInspireParams) =>
    request<Fetch.IQueryRandomInspireRes>({
      method: 'GET',
      url: '/deliver/random-inspire',
      params,
    } as IRequestOptions),
  /** 获取历史投放记录 */
  queryDeliverHistory: (params: Fetch.IQueryDeliverHistoryParams) =>
    request<Fetch.IQueryDeliverHistoryRes>({
      method: 'GET',
      url: '/deliver/history',
      params,
    } as IRequestOptions),
  /** 获取历史投放记录参数 */
  queryDeliverHistoryParams: (params: Fetch.IQueryDeliverHistoryParamsParams) =>
    request<Fetch.IQueryDeliverHistoryParamsRes>({
      method: 'GET',
      url: '/deliver/history-params',
      params,
    } as IRequestOptions),
  /** 获取产品库列表 */
  queryProductList: (params: Fetch.IQueryProductListParams) =>
    request<Fetch.IQueryProductListRes>({
      method: 'GET',
      url: '/item',
      params,
    } as IRequestOptions),
  /** 新增产品 */
  postProduct: (params: Fetch.IPostProductParams) =>
    request<Fetch.ICommonRes>({
      method: 'POST',
      url: '/item',
      params,
    } as IRequestOptions),
  /** 编辑产品 */
  putProduct: (params: Fetch.IDeleteProductParams) =>
    request<Fetch.ICommonRes>({
      method: 'PUT',
      url: '/item',
      params,
    } as IRequestOptions),
  /** 删除产品 */
  deleteProduct: (params: Fetch.IDeleteProductParams) =>
    request<Fetch.ICommonRes>({
      method: 'DELETE',
      url: '/item',
      params,
    } as IRequestOptions),
  /** 获取已存储的图片和视频 */
  queryImagePage: (params: Fetch.IQueryImagePageParams) =>
    request<Fetch.IQueryImagePageRes>({
      method: 'GET',
      url: '/img/page',
      params,
    } as IRequestOptions),
  /** 获取收藏夹图片和视频 */
  queryImageMarked: (params: Fetch.IQueryImageMarkedParams) =>
    request<Fetch.IQueryImagePageResM>({
      method: 'GET',
      url: '/img/marked',
      params,
    } as IRequestOptions),
  /** 生成一份推广文案 */
  createDeliverText: (params: Fetch.ICreateDeliverTextParams) =>
    request<Fetch.ICreateDeliverTextRes>({
      method: 'POST',
      url: '/deliver/copywriting-generate',
      params,
    } as IRequestOptions),
  /** 获取爆款图文 */
  createDeliverCrawl: (params: Fetch.ICreateDeliverCrawlParams) =>
    request<Fetch.ICreateDeliverCrawlRes>({
      method: 'POST',
      url: '/deliver/crawl',
      params,
    } as IRequestOptions),
  /** 获取全局默认配置 */
  getDefaultSetting: () =>
    request<Fetch.IGetDefaultSettingRes>({
      method: 'GET',
      url: '/dict/default-setting',
      forceLogin: false,
    } as IRequestOptions),
  getDefaultSettingMini: () =>
    request<Fetch.IGetDefaultSettingRes>({
      method: 'GET',
      url: '/dict/default-setting/mini',
    } as IRequestOptions),
  /** 自动投放 */
  postAutoDeliver: (params: Fetch.IAutoDeliverParams) =>
    request<Fetch.IAutoDeliverRes>({
      method: 'POST',
      url: '/auto-deliver',
      params,
    } as IRequestOptions),
  putAutoDeliver: (params: Fetch.IAutoDeliverParams) =>
    request<Fetch.IAutoDeliverRes>({
      method: 'PUT',
      url: '/auto-deliver',
      params,
    } as IRequestOptions),
  getAutoDeliver: () =>
    request<Fetch.IAutoDeliverRes>({
      method: 'GET',
      url: '/auto-deliver',
    } as IRequestOptions),
  /** 获取音乐榜单  */
  getMusicType: () =>
    request<Fetch.IGetMusicTypeRes>({
      method: 'GET',
      url: '/deliver/music-type',
    } as IRequestOptions),
  /** 获取音乐列表 */
  getMusicList: (params: Fetch.IGetMusicListParams) =>
    request<Fetch.IGetMusicListRes>({
      method: 'GET',
      url: '/deliver/music-billboard',
      params,
    } as IRequestOptions),
  /** 获取运营数据 */
  getDeliverStats: () =>
    request<Fetch.IGetDeliverStatsRes>({
      method: 'GET',
      url: '/deliver-stats',
    } as IRequestOptions),
  /** 问题反馈  */
  postFeedback: (params: Fetch.IPostFeedbackParams) =>
    request<Fetch.ICommonRes>({
      method: 'POST',
      url: '/feedback',
      params,
    } as IRequestOptions),
  /** 用户投放设置 */
  getDeliverConfig: () =>
    request<Fetch.IGetDeliverConfigRes>({
      method: 'GET',
      url: '/deliver-config',
    } as IRequestOptions),
  postDeliverConfig: (params: Fetch.IGetDeliverConfigRes) =>
    request<Fetch.IGetDeliverConfigRes>({
      method: 'POST',
      url: '/deliver-config',
      params,
    } as IRequestOptions),
  /** 获取封面设置 */
  getDictConfig: (params: { type: string }) =>
    request<Fetch.IGetDictConfigRes>({
      method: 'GET',
      url: '/dict/config',
      params,
    } as IRequestOptions),
  getDictConfigSub: (params: { type: string,sub_type:string }) =>
      request<Fetch.IGetDictConfigSubRes>({
        method: 'GET',
        url: '/dict/config',
        params,
      } as IRequestOptions),
  /** 获取oss上传地址 */
  getOssSign: () =>
    request<Fetch.IGetOssSignRes>({
      method: 'GET',
      url: '/img/oss-sign',
      noFormat: true,
    } as IRequestOptions),
  /** oss上传链接 */
  putOssUpload: (url, params) =>
    request<Fetch.ICommonRes>({
      method: 'POST',
      url,
      params,
      noBaseUrl: true,
    } as IRequestOptions),
  /** 获取上传结果 */
  getOssUpload: (params) =>
    request<Fetch.ICommonRes>({
      method: 'POST',
      url: '/img/front-upload',
      params,
    } as IRequestOptions),
   /** 查询客户线索列表 */
   getDeliverCustomerConversion: (params: { page_size?: number, page_num:number}) =>
    request<Fetch.ICustomerLeadsRes>({
      method: 'GET',
      url: '/deliver-customer/conversation',
      params,
    } as IRequestOptions),
    /** 查询客户线索列表 */
  getSupport: () =>
    request<Fetch.ISupportRes>({
      method: 'GET',
      url: '/working/support',
    } as IRequestOptions),
     /** 查询消息列表 */
  deliverCustomerClue: (params: Fetch.IDeliverCustomerClueParams) =>
    request<Fetch.IDeliverCustomerClueRes>({
      method: 'GET',
      url: '/deliver-customer/clue',
      params,
    } as IRequestOptions),
    deliverCustomerClueReplay: (params) =>
      request<Fetch.ICommonRes>({
        method: 'POST',
        url:'/deliver-customer/clue-reply',
        params
      } as IRequestOptions),
    getWorkingReviewWork: (params: Fetch.IWorkingReviewWorkParams) =>
      request<Fetch.IWorkingReviewWorkRes>({
        method: 'GET',
        url: '/working/review-work',
        params,
      } as IRequestOptions),
    postWorkingReviewWork: (params) =>
      request<Fetch.ICommonRes>({
        method: 'POST',
        url:'/working/review-work',
        params
      } as IRequestOptions),
    getWorkingProgressTimeline: () =>
      request<Fetch.IGetTimeLineRes>({
        method: 'GET',
        url: '/working/progress-timeline',
      } as IRequestOptions),
    getWorkingProgress: (params: Fetch.IWorkingProgressParams) =>
      request<Fetch.IWorkingProgressItem>({
        method: 'GET',
        url: '/working/progress',
        params,
      } as IRequestOptions),
    getWorkingArrangements: () =>
      request<Fetch.IArrangementsItem>({
        method: 'GET',
        url: '/working/arrangements',
      } as IRequestOptions),
      /** 获取产品库列表 */
    queryMaterialCatalog: (params: Fetch.IQueryProductListParams) =>
      request<Fetch.IQueryMaterialCatListRes>({
        method: 'GET',
        url: '/media',
        params,
      } as IRequestOptions),
    querySelfMaterialList: (params: Fetch.IQuerySelfMaterialParams) =>
      request<Fetch.IQuerySelfMaterialRes>({
        method: 'GET',
        url: '/media/items',
        params,
      } as IRequestOptions),
    deleteSelfMaterialList: (params:{media_id?:number,material_id?:number|null}) =>
        request<Fetch.IQuerySelfMaterialRes>({
          method: 'DELETE',
          url: '/media/items',
          params,
        } as IRequestOptions),
    /** 获取素材信息 */
    queryMediaDetail: (params: {material_id:number}) =>
      request<Fetch.IQueryMediaDetailRes>({
        method: 'GET',
        url: '/media/detail',
        params,
      } as IRequestOptions),
    /** 更新素材信息 */
    updateMediaDetail: (params: {material_id:number;media_label:string[]}) =>
      request({
        method: 'PUT',
        url: '/media/detail',
        params,
      } as IRequestOptions),
    /** 添加素材目录 */
    postMedia: (params) =>
      request<Fetch.ICommonRes>({
        method: 'POST',
        url:'/media',
        params
      } as IRequestOptions),
      /** 添加素材 */
    putMedia: (params: {is_init?:boolean;media_id?:number;material_ids:number[]}) =>
      request({
        method: 'PUT',
        url: '/media',
        params,
      } as IRequestOptions),
    queryKgList: (params: Fetch.IQueryKgParams) =>
      request<Fetch.IQueryKgRes>({
        method: 'GET',
        url: '/kg/user',
        params,
      } as IRequestOptions),
    queryKgTopicList: (params: Fetch.IQueryKgParams) =>
      request<Fetch.IQueryKgTopicRes>({
        method: 'GET',
        url: '/kg/user-topic',
        params,
      } as IRequestOptions),
    queryKgDetail: (url:string) =>
      request<Fetch.IQueryKgDetailRes>({
        method: 'GET',
        url,
        noBaseUrl: true,
        noCode:true
      } as IRequestOptions),
    queryPutKgTopic: (params: Fetch.IQueryPutKgParams) =>
      request<Fetch.IQueryKgTopicRes['records']>({
        method: 'POST',
        url: '/kg/user-topic',
        params,
      } as IRequestOptions),
    queryDeleteKg: (params: Fetch.IQueryPutKgParams) =>
      request<Fetch.ICommonRes>({
        method: 'DELETE',
        url: '/kg/user',
        params,
      } as IRequestOptions),
    queryKgPostItem: (params:{ kg_source_type:number,content:string}) =>
        request<Fetch.ICommonRes>({
          method: 'POST',
          url: '/kg/user',
          params,
        } as IRequestOptions),
    queryDictConfig: (params={type:'version_config',sub_type:'miniapp'}) =>
      request<Fetch.IGetDefaultSettingRes>({
        method: 'GET',
        url: '/dict/config',
        params,
      } as IRequestOptions),
    deleteAccount: (params: { id: number }) =>
      request<Fetch.ICommonRes>({
        method: 'DELETE',
        url: '/deliver/account',
        params,
      } as IRequestOptions),
    getNotice: () =>
        request<Fetch.ITaskObj>({
          method: 'GET',
          url: '/notice/tasks',
        } as IRequestOptions),
    getHots: (params: { page_size: number,page_num:number }) =>
        request<Fetch.IHots>({
          method: 'GET',
          url: '/working/hot-topics',
          params,
        } as IRequestOptions),
    getWorks: (params: { page_size: number,page_num:number }) =>
      request<Fetch.IWorks>({
        method: 'GET',
        url: '/idea/works',
        params,
      } as IRequestOptions),
    getTodos: () =>
      request<Fetch.ITodos>({
        method: 'GET',
        url: '/working/support-items',
      } as IRequestOptions),
    getLines: (params: { page_size: number,page_num:number }) =>
      request<Fetch.ILines>({
        method: 'GET',
        url: '/user/crawler-intend/list',
        params,
      } as IRequestOptions),
    getIdeaWork: (params: { work_id: number}) =>
      request<Fetch.IHotItem>({
        method: 'GET',
        url: '/idea/work',
        params,
      } as IRequestOptions),
    queryNoticeTask:( params:Fetch.IArrangeWork) =>
      request({
        method: 'POST',
        url: '/notice/tasks',
        params,
      } as IRequestOptions),
    queryWorkingAdd:( params:{
      select_topic_id:number
    }) =>
      request({
        method: 'POST',
        url: '/working/relate-topic',
        params,
      } as IRequestOptions),
    /** 审批作品接口 */
    updateWorkingSupport: (params:{
      id: number;
      approved?: boolean;
      content?:string;
      material_approve_id?:number;
      topics?:string[]
    }) =>
      request<Fetch.IGetUserInfoRes>({
        method: 'PUT',
        url: '/working/support',
        params,
      } as IRequestOptions),
    getMaterialDemand: (params: { page_size: number,page_num:number }) =>
        request<Fetch.IMaterialDemandS>({
          method: 'GET',
          url: '/material/demand',
          params,
        } as IRequestOptions),
    materialDemand: (params:{
          id: number;
          image_id: number
        }) =>
        request<Fetch.IGetUserInfoRes>({
          method: 'PUT',
          url: '/material/demand',
          params,
        } as IRequestOptions),
    getUserPreTask: () =>
      request<Fetch.IUserPreWork>({
        method: 'GET',
        url: '/user/prepare-task'
      } as IRequestOptions),
    putUserPreTask: (params: Fetch.putParams) =>
      request<Fetch.IUserPreWork>({
        method: 'PUT',
        url: '/user/prepare-task',
        params
      } as IRequestOptions),
    putUsrPersonality: (params:Fetch.basicInfo[]) =>
      request({
        method: 'PUT',
        url: '/user/personality',
        params
      } as IRequestOptions),
    getWorkingReviewWorkShare: (params:{
      id:number;
      type?:number
    }) =>
        request<Fetch.WorkingReviewShare>({
          method: 'GET',
          url: '/share/work',
          params,
        } as IRequestOptions),
    queryDelivery:( params:{
        work_id:number;
        date:string;
        time:string;
        account_ids:number[]
      }) =>
        request({
          method: 'POST',
          url: '/deliver/schedule',
          params,
        } as IRequestOptions),
    getSearchReferredAccount: ( params:{
        url:string;
      }) =>
        request<Fetch.IReferredAccountItem>({
          method: 'GET',
          params,
          url: '/referred-account/search'
        } as IRequestOptions),
    getReferredAccount: ( params:{
      industry:string;
    }) =>
      request<Fetch.IReferredAccount>({
        method: 'GET',
        params,
        url: '/referred-account'
      } as IRequestOptions),
    postReferredAccount: (params:string[]) =>
      request({
        method: 'POST',
        params,
        url: '/referred-account'
      } as IRequestOptions),
    getWorkingHotPic: (params:{
      topic_id:number;
      refresh_demand:boolean;
    }) =>
        request<Fetch.IWorkingHotPic>({
          method: 'GET',
          params,
          url: '/working/hot-topic'
        } as IRequestOptions),
    getWorkingApproveMaterial: (params:{
       page_size:number;
       from_id?:number;
      }) =>
      request<Fetch.IMaterialReviewList>({
        method: 'GET',
        params,
        url: '/working/approve-material'
      } as IRequestOptions),
    getWalletMember: () =>
      request<Fetch.IWalletMember>({
        method: 'GET',
        url: '/wallet/member'
      } as IRequestOptions),
    postWalletPay: (params:{
      charge_type:number;
      pay_type:2;
      member?:{
        member_version: "团队版",
        member_type: "营销发展员工",
        month: number
      },
      computility?:{
        num:number
      }
    }) =>
      request<Fetch.IWalletPay>({
        method: 'POST',
        params,
        url: '/wallet/pay-qrcode'
      } as IRequestOptions),
    getWalletReward: (params: { page_size: number, page_num:number}) =>
      request<Fetch.IWalletBillS>({
        method: 'GET',
        url: '/wallet/bill',
        params,
      } as IRequestOptions),
    postDeAccount: (params:{
        id: number
        relation_component_id: string
      }) =>
        request({
          method: 'POST',
          params,
          url: '/deliver/edit-account'
        } as IRequestOptions),
    getMarkInfo: () =>
      request<Fetch.markInfo>({
        method: 'GET',
        url: '/initiative-marketing/info',
      } as IRequestOptions),
    postMarkSwitch: (params:{
      switch:boolean
    }) =>
      request({
        method: 'POST',
        params,
        url: '/initiative-marketing/switch'
      } as IRequestOptions),
    postWalletConsume: (params:{
        type:number,
        count:number
      }) =>
        request({
          method: 'POST',
          params,
          url: '/wallet/consume'
        } as IRequestOptions),
    getInitMarConfig: (
      params:{
        type?:string
      }
    ) =>
      request<Fetch.InitMarConfig>({
        method: 'GET',
        params,
        url: '/initiative-marketing/config',
      } as IRequestOptions),
    postInitMarConfig: (
      params:{
        type?:string | 'customer_dig';
        paper_deliver_district?:string;
        paper_deliver_content?:string;
        min_customer_level?:string;
        keyword?:string[];
        platform?:string[];
      }
    ) =>
      request({
        method: 'POST',
        params,
        url: '/initiative-marketing/config',
      } as IRequestOptions),
  getInitMarkCus: (params: { page_size: number, page_num:number}) =>
      request<Fetch.InitMarkCus>({
        method: 'GET',
        url: '/initiative-marketing/customer',
        params,
      } as IRequestOptions),
  getInitMarkCusCD: (params: { page_size: number, page_num:number}) =>
    request<Fetch.InitMarkCusCD>({
      method: 'GET',
      url: '/initiative-marketing/deliver-clue',
      params,
    } as IRequestOptions),
  postInitMarFollow: (
    params:{
      id:number;
      follow:boolean
    }
  ) =>
    request({
      method: 'POST',
      params,
      url: '/initiative-marketing/follow',
    } as IRequestOptions),
  postInitMarCusReplay: (
      params:{
        id:number;
        reply:string
      }
    ) =>
      request({
        method: 'POST',
        params,
        url: '/initiative-marketing/customer-reply',
      } as IRequestOptions),
  postWalletComputility: (
        params:{
          num?:number;
          type:string;
          open?:boolean
        }
      ) =>
        request({
          method: 'POST',
          params,
          url: '/wallet/computility',
        } as IRequestOptions),
  postDelSendCode: (params: Fetch.IGetDelSendCodeParams) =>
      request<Fetch.ICommonRes>({
        method: 'POST',
        url: '/deliver/send-code',
        params,
      } as IRequestOptions),
  postDelLogin: (params: Fetch.IGetDelLoginParams) =>
      request<Fetch.ICommonRes>({
        method: 'POST',
        url: '/deliver/phone-login',
        params,
      } as IRequestOptions),
  postUserInviteCode: (params: {invite_code:string}) =>
    request<Fetch.ICommonRes>({
      method: 'POST',
      url: '/user/invite-code',
      params,
    } as IRequestOptions),
  postInitMarLabel: (params: {exist_labels:string[]}) =>
    request<{labels:string[]}>({
      method: 'POST',
      url: '/initiative-marketing/labels',
      params,
    } as IRequestOptions),
  deleteMaterialDemand: (params: { id: number }) =>
    request<Fetch.ICommonRes>({
      method: 'DELETE',
      url: '/material/demand',
      params,
    } as IRequestOptions),
  getUserConcernTopic: () =>
    request<string[]>({
      method: 'GET',
      url: '/user/concern-topic',
    } as IRequestOptions),
  postUserConcernTopic: (params:string[]) =>
    request({
      method: 'POST',
      url: '/user/concern-topic',
      params,
    } as IRequestOptions),
  postWorkRefreshTopic: () =>
      request({
        method: 'POST',
        url: '/working/refresh-topic',
      } as IRequestOptions),
  getRefAccount: () =>
    request<{
      nickname:string;
      avatar:string;
      id:number
    }[]>({
      method: 'GET',
      url: '/referred-account',
    } as IRequestOptions),
  postRefreshAccountOne: (
    params: { url: string,platform:string,type:number }
  ) =>
    request({
      method: 'POST',
      url: '/referred-account/one',
      params
    } as IRequestOptions),
  deleteReferredAccount: (params: { id: number }) =>
    request<Fetch.ICommonRes>({
      method: 'DELETE',
      url: '/referred-account',
      params,
    } as IRequestOptions),
  getNoticeTask: (params:{task_type:number}) =>
      request<{
        finished:boolean
      }>({
        method: 'GET',
        url: '/notice/task',
        params
      } as IRequestOptions),
  deliverCustomerMsgClue: (params: Fetch.IDeliverCustomerClueParams) =>
    request<Fetch.IDeliverCustomerClueRes>({
      method: 'GET',
      url: '/customer-msg/clue',
      params,
    } as IRequestOptions),
  deliverCustomerMsgEmployee: (params: Fetch.IDeliverCustomerClueParams) =>
    request<Fetch.IDeliverCustomerEmployeeRes>({
      method: 'GET',
      url: '/customer-msg/employee',
      params,
    } as IRequestOptions),
  deliverCustomerMsgMessage: (params: Fetch.IDeliverCustomerMessageParams) =>
    request<Fetch.IDeliverCustomerMessageRes>({
      method: 'GET',
      url: '/customer-msg/message',
      params,
    } as IRequestOptions),
  deliveryNoticeList: (params: Fetch.IGetNoticeParams) => 
    request<Fetch.INoticeRes>({
      method: 'GET',
      url: '/home/notices',
      params
    } as IRequestOptions),
  deliveryUserExtension: () => 
    request<Fetch.INoticeRes>({
      method: 'GET',
      url: '/user/IUserExtensionRes'
    } as IRequestOptions),
  deliveryCustomerMsg: (params: Fetch.IGetCustomerMsgParams) =>
    request<Fetch.ICustomerMsgRes>({
      method: 'GET',
      url: '/customer-msg/private-msg',
      params
    } as IRequestOptions),
  deliveryCustomerQueryProperty: (params: Fetch.IGetCustomerPropertyParams) =>
    request<Fetch.ICustomerPropertyRes>({
      method: 'GET',
      url: '/item/property',
      params
    } as IRequestOptions),
  queryEnterpriseInfo: () =>
    request<Fetch.IEnterpriseInfoRes>({
      method: 'GET',
      url: '/company/info',
    } as IRequestOptions),
  updateEnterpriseInfo: (params: Fetch.IEnterpriseInfoRes) =>
    request<Fetch.IEnterpriseInfoRes>({
      method: 'PUT',
      url: '/company/info',
      params
    } as IRequestOptions)
};
export default fetch;
