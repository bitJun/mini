declare namespace StoreState {
  /** Common模块 */
  type Common = {
    systemInfo: any;
    globalLoading: boolean;
    chatLoading: boolean;
    defaultSetting: any;
    dicSetting: any;
    defaultSettingNoLogin: any;
    chatList: Fetch.IQueryChatListRes;
    customerList:Fetch.ICustomerLeadsRes;
    supportList:Fetch.ISupportRes;
    taskList: Fetch.ITaskObj;
    hotList: Fetch.IHots;
    workList:Fetch.IWorks;
    todoList:Fetch.ITodos;
    lineList:Fetch.ILines;
  };
}
