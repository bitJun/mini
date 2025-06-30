declare global {
  namespace Fetch {
    type ICommonRes = { __result: 1 | 0 }; // 通用返回 返回值为null时
    type IPaging = { current: number; size: number; total: number }; // 通用分页
    type IGetSmsParams = { phone: string };
    type IPhoneLoginParams = { phone: string; code: string;wx_mini_code:string };
    type IPreLoginParams = { code: string };
    type ILoginParams = { pre_auth: string; code: string };
    type IUserInfo = {
      username: string;
      nickname: string;
      gender: 0 | 1 | 2;
      avatar_path: string;
      figure:any;
      voice:any;
      figure_extra:any;
      in_company:boolean,
      prepare_task_finished:boolean,
      industry?:string;
      employee:{
        avatar: string;
        credit: number;
        department: string;
        level:string;
        name: string;
        onboard_days: number;
        position: string;
      },
      need_invite_code:boolean
    };
    type ILoginRes = {
      access_token: string;
      userinfo: IUserInfo;
    };
    type IPreLoginRes = {
      key: string;
    };
    type IGetSecurityRes = { passwd_set: boolean; phone: string | null; wx_bind: boolean };
    type ICreateChatParams = { name: string };
    type IChatListItem = { id: number; name: string; last_msg?: string; last_msg_create_time: string };
    type IQueryChatListRes = IChatListItem[];
    type IQueryMessageListParams = { conversation_id: number; msg_id?: number; back?: true; size?: number };
    type IImageItem = {
      classify: number;
      conversation_id: number;
      head_img_path: null;
      http_img_path: string;
      id: number;
      img_name: string;
      img_path: string;
      mark: number;
      msg_id: number;
      source: number;
      type: number;
      user_like: number;
    };
    type IQueryMessageListItem = {
      id: number;
      conversation_id: number;
      msg_format: number;
      sender_type: number;
      words: string;
      images: IImageItem[];
      create_time: number;
      is_from_user: boolean;
      is_scene: boolean;
      approve_status:number;
      work_id:number;
      topics?:{
        summary:string;
        topic:string;
      }[]
    };
    type IQueryMessageListRes = IQueryMessageListItem[];
    type IGetUserInfoRes = IUserInfo;
    type IGetUserAuthRes = {
      auth_type: string;
      enable: true;
      info: string;
    }[];
    type IAccountItem = {
      id: number;
      account_id: string;
      image: string;
      name: string;
      online_status: string;
      platform: string;
      owner?:string;
      account_role?:string;
      active?:boolean;
      platform_url?:string;
      relation_component_id:string | null
    };
    type IDeliverGroupItem = {
      id: number;
      name: string;
    };
    type IGetDeliverGroupRes = IPaging & {
      records: IDeliverGroupItem[];
    };
    type IGetDeliverGroupAccountRes = IAccountItem[];
    type IGetGroupAccountParams = { size: number };
    type IGetGroupAccountRes = [];
    type IGetAccountParams = { fetch_all: boolean };
    type IGetAccountRes = IPaging & {
      records: IAccountItem[];
    };
    type ICheckStatusAccountParams = { account_id: number };
    type ICheckStatusAccountRes = { is_online: boolean };
    type IGetWxBindQrCodeRes = {
      discount_msg: null;
      expire_seconds: number;
      key: string;
      url: string;
    };
    type IGetCreateQrCodeParams = { id?: number; platform: string,account_type?:string };
    type IGetCreateQrCodeRes = { expire_seconds: number; image: string };
    type IQuitCreateQrCodeParams = { platform: string };
    type IGetLoginQrCodeParams = { code?: string; platform: string };
    type ILogoutAccountParams = { id: number };
    type IGetLoginQrCodeRes = {};
    type IPutImageUploadParams = {};
    type IPutImageUploadRes = {};
    type DataItem = {
      name?: string;
      desc?: string;
      paths:any;
      path?:''
    };
    type DataAItem = {
      name: string;
      desc: string;
      path:string;
    };
    type virtualProfileD = {
      audio_voice:string;
      id:number;
      name:string;
      word_style:string;
      clone_video_path:string;
      figure: {
        head_img_path:string;
        http_img_path:string;
        img_path:string;
      }
    }[];
    type IUpdateUserInfoParams = { nickname?: string; gender?: string, voice?:DataAItem[],
      figure?: DataItem[];
      type?: number;
      audio_voice?: string;
      clone_video_path?:string;
      word_style?:string;
      figure_version?:string;
      month?:number;
     };
    type IUpdateUserAvatarParams = { avatar_path: string };
    type IUpdateUserPhoneParams = { phone: string; code: string };
    type IQueryRandomInspireParams = { size: number };
    type IQueryRandomInspireRes = {
      category: string;
      content: string;
      id: number;
      images: string[];
      title: string;
      topics: string[];
    }[];
    type IQueryDeliverHistoryParams = { fetch_all: boolean; status?: number };
    type IDeliverLogItem = {
      account: string;
      account_group: string;
      deliver_platform: { platform: string; chineseName: string; httpImagePath: string };
      deliver_time: string;
      display: string;
      error_image: string;
      error_info: string;
      history_id: number;
      id: number;
      platform: string;
      status: number;
    };
    type IQueryDeliverHistoryRes = IPaging & {
      records: {
        create_time: string;
        deliver_log: IDeliverLogItem[];
        deliver_type: number;
        deliver_type_str: string;
        id: number;
        images: {
          http_img_path: string;
          id: number;
          img_path: string;
        }[];
        item_name: string;
        status: number;
        success_account: number;
        total_account: number;
        update_time: string;
      }[];
    };
    type IQueryDeliverHistoryParamsParams = { deliver_type: string; page_size: number };
    type IQueryDeliverHistoryParamsRes = {
      deliver_group_param: any;
      deliver_param: any;
      deliver_type: string;
      extra: any;
      history_id: number;
      image_ids: number[];
      images: any;
      item_id: any;
      item_info: any;
    }[];
    type IQueryProductListParams = { page_size: number; page_num: number; fetch_all: boolean };
    type IQueryProductListRes = IPaging & {
      records: {
        id: number;
        category: number;
        color: string;
        description: string;
        item_type: string;
        material: string;
        name: string;
        price: string;
        property: string;
        size: string;
        label: string[];
        images: {
          http_img_path: string;
          id: number;
          img_path: string;
        }[];
        item_url: { commission: string; display_mode: string; platform: string; url: string }[];
        save_vector_status:number,
        selected?: boolean
      }[];
    };
    type IPostProductParams = {
      name?: string;
      item_type?: string;
      category: number;
      price?: string;
      description: string;
      images: any;
      videos: any;
      material?: string;
      color?: string;
      size?: string;
      label: string[];
      property: string;
      item_url: {
        platform: string;
        url: string;
        commission: string;
        display_mode: '0' | '1';
      }[];
      status:string;
    };
    type IPutProductParams = { id: number } & IPostProductParams;
    type IDeleteProductParams = { id: number };
    type IQueryImagePageParams = { conversation_id: number; page_size: number,page_num:number };
    type IImagePage = {
      classify: number;
      conversation_id: number;
      head_img_path: null;
      http_img_path: string;
      id: number;
      img_name: string;
      img_path: string;
      mark: number;
      msg_id: number;
      source: number;
      type: number;
      user_like: number;
    };
    type IQueryImagePageRes = IPaging & {
        records:IImagePage[];
    }
    type IQueryImagePageResM = IImagePage[];
    type IQueryImageMarkedParams = { conversation_id: number };
    type ICreateDeliverTextParams = {
      copywriting_generate_type: string;
      item_id: null;
      tone: string;
      words: string;
    };
    type ICreateDeliverTextRes = {};
    type ICreateDeliverCrawlParams = {
      conversation_id: number;
      platform: string;
      url: string;
    };
    type ICreateDeliverCrawlRes = {
      is_image: boolean;
      title: string;
      content: string;
      images: IImageItem[];
    };
    type IGetDefaultSettingRes = {};
    type IAutoDeliverParams = {
      id?: number;
      conversation_id?: number;
      account_ids: number[];
      permission: number;
      status: number;
      auto_mixcut: number;
      time: string;
      music: string;
      type: number;
    };
    type IAutoDeliverRes = {
      id: number;
      account_ids: number[];
      permission: string;
      status: string;
      auto_mixcut: string;
      time: string;
      music: string;
      type: string;
    }[];
    type IMusicTypeItem = {
      code: number;
      chineseName: string;
      englishName: string;
    };
    type IGetMusicTypeRes = IMusicTypeItem[];
    type IGetMusicListParams = {
      platform: string;
      board_name: string;
    };
    type IMusicListItem = {
      id: number;
      duration: number;
      author: string;
      board_name: string;
      platform: string;
      share_url: string;
      title: string;
    };
    type IGetMusicListRes = IMusicListItem[];
    type IGetDeliverStatsRes = {
      platform_pie_board: { [platform: string]: { percent: number } };
      platform_stats_board: {
        id: number;
        last_30_day_play: number;
        last_30_day_work: number;
        platform_name: string;
        total_account_num: number;
        total_fan_num: number;
      }[];
      total_stats_board: {
        last_1_day_clue: number;
        last_1_day_interact: number;
        last_1_day_play: number;
        last_30_day_play: number;
        last_30_day_work: number;
        last_update_time: string;
        total_account_num: number;
        total_fan_num: number;
      };
    };
    type IPostFeedbackParams = {
      content: string;
      images: string[];
      phone: string;
    };
    type IGetDeliverConfigRes = {
      cover_title_style_dict: string;
      location: string;
      text_watermark: string;
      topic_group: {
        customTopic: string;
        id: number | null;
        inputVisible: boolean;
        is_default: boolean;
        name: string;
        topics: string[];
      }[];
      with_watermark: boolean;
    };
    type IGetDictConfigRes = {
      sub_type: string;
      type: string;
      content: {
        image: string;
        name: string;
      };
    }[];
    type IGetDictConfigSubRes = {
      sub_type: string;
      type: string;
      content:any;
    }[];
    type IGetOssSignRes = {
      accessid: string;
      dir: string;
      expire: string;
      filename: string;
      host: string;
      policy: string;
      signature: string;
    };
    type ICustomerLeads = {
      id: number;
      name: string;
      last_msg?: string;
      last_msg_create_time: string,
      image: string;
      platform:string;
      latest_clue_content:string;
      latest_clue_time:string;
      user_avatar: string;
      platform_account:{
        nick_name?: string;
        user_avatar: string;
      },
      deliver_account:{
        platform?: string;
      },
    };
    //  IPaging &
    type ICustomerLeadsRes = {
      records: ICustomerLeads[];
    };
    type ISupport = {
      content:string;
      supporter:string;
      id: number;
      end_time:string;
    };
    type ISupportRes = {
      items: ISupport[];
    };
    type IDeliverCustomerClueItem = {
      id: number;
      content: {
        text:string;
      };
      clue_time: string;
      is_from_user: boolean;
    };
    type IDeliverCustomerClueRes = {
      records:IDeliverCustomerClueItem[],
      total:number
    };
    type IDeliverCustomerClueResO = IDeliverCustomerClueItem[]
    type IDeliverCustomerClueParams = { conversation_id?: number; page_size: number; page_num: number };
    type IDeliverCustomerMessageItemUser = {
      account_id: string;
      account_unique_id: string;
      nickname: string;
      avatar: string;
      ip_location: string;
    }
    type IDeliverCustomerMessageItemWork = {
      work_id: number;
      unique_id: string;
      work_type: number;
      cover: string;
    }
    type IDeliverCustomerMessageItemMy = {
      account_id: string;
      account_unique_id: string;
      nickname: string;
      avatar: string;
      ip_location: string;
    }
    type IDeliverCustomerMessageItem = {
      message_id: string | number;
      message_type: string | number;
      original_id: string | number;
      platform: number;
      content: string;
      publish_time: string;
      user: Array<IDeliverCustomerMessageItemUser>;
      work: Array<IDeliverCustomerMessageItemWork>;
      my: Array<IDeliverCustomerMessageItemMy>;
    };
    type IDeliverCustomerMessageRes = {
      records:IDeliverCustomerMessageItem[],
      total:number
    };
    type IDeliverCustomerEmployeeItem = {
      account_id: string;
      account_unique_id: string;
      nickname: string;
      avatar: string;
      unread: number
    }
    type IDeliverCustomerEmployeeRes = {
      records:IDeliverCustomerEmployeeItem[],
      total:number
    }
    type IDeliverCustomerMessageParams = { account_id?: number | string; page_size: number; page_num: number };
    type IWorksData = {
      id:number;
      content:string;
      cover:{
        http_img_path?:string | '';
        head_img_path?:string | '';
      };
      images:any;
      title:string;
      topics:any;
      trigger_time:string;
    }
    type IWorkingReviewWorkItems = {
      user:{
        avatar_path:string | '';
      },
      history_id:number;
      works:IWorksData[]
    };
    type IWorkingReviewWorkRes = {
      id?:number;
      approve_status?:number;
      content?:string;
      title:string;
      items:IWorkingReviewWorkItems[]
    }
    type IWorkingReviewWorkRes1 = {
      id?:number;
      approve_status?:number;
      content?:string;
      title:string;
      images:any,
      topics?:string[]
    }
    type IWorkingReviewWorkParams = {
      msg_id:number;
    }
    type IPWorkingReviewWorkParams = {
      msg_id:number;
      items:any;
    }
    type ITimelineItem = {
      desc:string;
      quarter:number;
      year:number;
    };
    type IGetTimeLineRes = ITimelineItem[];
    type IWorkingProgressParams = {
      quarter:number;
      year:number;
    };
    type IWorkingProgressItem = {
      onboard_info:string;
      work_effect:any;
      work_info:any;
    };
    type IArrangementsItem = {
      date:string;
      header:{
        avatar:string;
        desc:string;
      };
      target:{
        generate_index:number;
      };
    };

    type IQueryMaterialCatItem = {
      cannot_deleted: boolean;
      desc: string;
      id: number;
      name: string;
    };
    type IQueryMaterialCatListRes = IPaging & {
      records: IQueryMaterialCatItem[];
    };

    type IQuerySelfMaterialParams = { page_size: number; page_num: number; fetch_all?: boolean;image_type?: string;media_id?:number;media_label?:string};
    type IQuerySelfMaterialRes = IPaging & {
      records: {
        id: number;
        head_img_path: string;
        http_img_path: string;
        label: string[];
        media_label: string[];
        img_path: string;
        img_name: string;
        save_vector_status:number;
        type?:number
      }[];
    };
    type IQueryMediaDetailRes = {
      detail:{
        info:{
          name:string;
          value:string;
        }[];
        quality:string;
      };
      http_img_path:string;
      head_img_path:string;
      id:number;
      media_label:string[];
      type:number;
    }

    type IQueryMaterialKg = {
      id: number;
      name: string;
      parse_status:number;
      kg_source_type:number;
      parsed_file_path:string;
      original_url:string;
    };
    type IQueryKgParams = { page_size: number; page_num: number; fetch_all?: boolean;kg_id?: number;};
    type IQueryKgRes = IPaging & {
      records: IQueryMaterialKg[];
    };
    type IQueryKgTopicRes = IPaging & {
      records: {
        id: number;
        related_kg_info: [];
        topic:string;
        summary:null | string;
      }[];
    };
    type IQueryKgDetailRes = {
      summary:string;
      tags:string[];
      text:string[];
      time:string;
      title:string;
    };
    type IQueryPutKgParams = { kg_id?:number;topic_id?:number};
    type ICustomerLineItem = { id: number; contact: string; intend_source: string; nickname: string;address:string;chat_history: string;avatar_path:string;};

    type ITask = {
      id:string;
      info:string;
      status_code: number;
      status:string;
      estimate_finish_time:string;
    };
    type ITaskObj = ITask[];

    type IHotItem = {
      id?:number;
      content?:string;
      publish_time?:string;
      video_url: string;
      cover:string | {head_img_path: string},
      type?:string;
      name?:string;
      title?: string;
      images?:any;
      create_time?:string;
      working_task_id?:string;
      selected:boolean,
      source:string,
      labels?:string[],
      topics?:string[],
      material_demands?:any,
      fulfill_info?:{
        score:number
      }
    };
    type IHots = IPaging & {
      records:IHotItem[];
    }
    type IWorks = IPaging & {
      records:IHotItem[]
    };

    type ITodo = {
      type:string;
      content:string;
      textVal?:string;
      extra_info?:{
        work_id?:number;
        platform?: string;
        placeholder?:string;
        platform_info:{
          chineseName:string;
          httpImagePath:string;
          platform: string;
        }
      },
      id:number
    };
    type ITodos = ITodo[];

    type ILine = {
      id:number;
      nickname:string;
      contact:string;
      intend_source:string;
      chat_history:any;
      location:string;
      label:string[];
      avatar_path:string;
    };
    type ILines = IPaging & {
      records:ILine[]
    };
    type IArrangeWork = {
      tool_type:number | string,
      tool_param:{
        words?:string;
        image_ids?: number[];
        bg_material_ids?: number[];
        item_id?: number;
        generate_by:string;
        generate_type?: string;
        select_topic_id?: number;
        return_num?:string;
      },
      words:string
    }
    type IMaterialDemand = {
      id:number;
      content:string;
      name?:string;
      title: string;
      images?:any;
      create_time:string;
      is_public:boolean;
      type:number;
    };
    type IMaterialDemandS =  IPaging & {
      records:IMaterialDemand[]
    }
    type basicInfo = {
      name:string;
      remark:string;
      items:{
        options:null | string[];
        k:string;
        v:string;
        required:boolean;
        placeholder:string;
        editable:boolean;
        option_hover:null | string[];
      }[]
    }
    type IUserPreWork = {
      bind_account:{
        title:string;
        text:string;
        clicked:number;
        finished:number;
        step:number;
        params?:any;
      },
      upload_material:{
        title:string;
        text:string;
        clicked:number;
        finished:number;
        step:number;
        params?:any;
      },
      company_train:{
        title:string;
        text:string;
        clicked:number;
        finished:number;
        step:number;
        params:{
          basicInfo:basicInfo[];
        };
      },
      working_arrangements:{
        title:string;
        text:string;
        clicked:number;
        finished:number;
        step:number;
        tasks:{
          title:string;
          text:string;
          clicked:number;
          finished:number;
          step:number;
        }[];
      },
    };
    type putParams = {
      name:string;
      material_ids?:number[];
      item_ids?:number[];
      trigger_task_name?:string;
    }
    type WorkingReviewShare = {
      id:number;
      content?:string;
      title:string;
      cover:{
        head_img_path:string;
        http_img_path:string;
      },
      images:{
        head_img_path:string;
        http_img_path:string;
        id:number;
      }[]
    };
    type IReferredAccountItem = {
      nickname:string;
      avatar:string;
      total_favorited:string;
      aweme_count:string;
      sec_uid:string;
      is_industry:boolean;
      signature:string;
      unique_id:string;
    }
    type IReferredAccount = IReferredAccountItem[];
    type IWorkingHotPic =  {
      fulfill_info:{
        score:number;
        advice:string;
        label:string;
        code:number;
      },
      material_demands:IMaterialDemand[]
    }
    type IMaterialReview = {
      id: number;
      title:string;
      content:string;
      images:{
        img_path:string;
        http_img_path:string;
        head_img_path:string;
        type:number
      }[]
    }
    type IMaterialReviewList = {
      current: number;
      size: number;
      total: number;
      records: IMaterialReview[];
    };
    type rule = {
      k:string;
      v:string
    }[];
    type initRule = {
      k:string;
      v:string;
      type:string;
      open?:boolean;
      num?:number
    }[];
    type IWalletMember = {
      hired:boolean;
      expire_at:string;
      balance:string;
      member_type:string;
    };
    type ability = {
      name:string;
      desc:string;
      logo:string;
      summary:string;
    }[];
    type sdr = {
      ability:ability;
      name:string;
      header:string;
      salary_per_month:number;
      benefit:string;
      summary:string;
      notice:string
    }
    type IWalletPay = {
      expire_seconds:number;
      key:string;
      prepay_id:string;
      prepay_req:{
        appId:string;
        nonceStr:string;
        package:string;
        paySign:string;
        signType:string;
        timeStamp: string;
      }
    }
    type prices = {
      k:string;
      v:string;
      desc:string;
      price:number
    }[];
    type figureConfig = {
     cost:string;
     desc:string;
     example:string[],
     name:string
    }[];
    type vocalConfig = {
      cost:string;
      desc:string;
      example:string[],
      name:string
     }[];
    type markInfo = {
      switch:boolean;
      balance:number;
      concern_clue:number;
      relate_clue:number;
      task:string;
      click_status:number;
      create_time:string;
    }
    type IWalletBill = {
      id: number;
      consume_amount: string;
      consume_type: string;
      create_time: string;
    }
    type IWalletBillS =  IPaging & {
      records:IWalletBill[]
    }
    type IinitMarketingConfig = {
      addition:number
      computility:number
      count:number
    }[]
    type InitMarConfig = {
      min_customer_level:string;
      keyword:string[];
      platform:{
        chineseName:string;
        httpImagePath:string;
        platform: string;
      }[];
      task:string;
      click_status:number,
      switch?:boolean,
      error_type:number,
      paperDeliverSwitch?:boolean,
      paperDeliverDistrict?:string,
      paperDeliverContent?:string,
    }
    type InitMarkCusItem = {
      id:number;
      level:string;
      platform:{
        chineseName:string;
        httpImagePath:string;
        platform: string;
      },
      account_name:string;
      account_avatar:string;
      account_label:string[];
      account_concern:string;
      content:string;
      content_time:string;
      comment:string;
      comment_time:string;
      reply:string;
      reply_time:string;
      work_url:string;
      reply_status:number;
      follow:boolean;
      title?:string;
      hot_comments?:string[],
    }
    type InitMarkCusItemCD = {
      id:number;
      platform:{
        chineseName:string;
        httpImagePath:string;
        platform: string;
      },
      content:string;
      work_url:string;
      reply:string;
      reply_time:string;
      content_time:string;
      follow:boolean;
      account_avatar:string;
      title?:string;
      hot_comments?:string[],
      interact_num?:number,
      account_name?:string
    }
    type InitMarkCus = IPaging & {
      finish_num:number;
      level_s_num:number;
      records:InitMarkCusItem[]
    }
    type InitMarkCusCD = IPaging & {
      weekly_finish_num:number;
      weekly_estimate_touch_num:number;
      records:InitMarkCusItemCD[]
    }
    type IGetDelSendCodeParams = { phone: string;platform:string};
    type IGetDelLoginParams = { phone: string;platform:string;code:string};
  }
}

export {};