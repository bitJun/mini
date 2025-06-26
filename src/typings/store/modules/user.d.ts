declare namespace StoreState {
  /** User模块 */
  type User = {
    /** 用户基本信息 */
    userInfo: Fetch.IUserInfo;
    userAuth: Fetch.IGetUserAuthRes;
    groupAccount: Fetch.IGetGroupAccountRes;
    memberInfo: Fetch.IWalletMember;
    balanceOff:boolean
  };
}
