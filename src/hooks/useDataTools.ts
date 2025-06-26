import { storeActions, useStoreData } from '@/store';
import { useMemo } from 'react';

type IUseDataToolsParams = {
  platformCode?: number;
};

const useDataTools = (params?: IUseDataToolsParams) => {
  const { platformCode } = params || {};

  const { groupAccount } = useStoreData(({ user }) => ({
    groupAccount: user.groupAccount,
  }));

  const getDefaultSetting = async () => {
    const defaultSetting = await storeActions('GET_DEFAULT_SETTING');
    return defaultSetting;
  };

  /** 获取随机口吻 */
  const getRandomTone = async () => {
    const { deliver_tone } = await getDefaultSetting();
    return deliver_tone[Math.floor(Math.random() * deliver_tone.length)].chineseName;
  };

  /** 获取平台列表 */
  const platforms = useMemo(() => groupAccount.map(({ platform }) => platform), [groupAccount]);

  /** 获取账号列表 */
  const accounts = useMemo(() => {
    if (!groupAccount) return [];
    if (!platformCode) {
      return groupAccount
        .map(({ items, platform }) => {
          // @ts-ignore
          return items.map((item) => ({ ...item, platformUrl: platform.url }));
        })
        .flat();
    } else {
      return (
        groupAccount
          // @ts-ignore
          .filter(({ platform }) => platform.code === platformCode)
          // @ts-ignore
          .map(({ items, platform }) => {
            // @ts-ignore
            return items.map((item) => ({ ...item, platformUrl: platform.url }));
          })
          .flat()
      );
    }
  }, [groupAccount, platformCode]);

  return { platforms, accounts, getDefaultSetting, getRandomTone };
};

export default useDataTools;
