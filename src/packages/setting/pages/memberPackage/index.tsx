import { useStoreData } from '@/store';
import { Button, ConfigProvider, FixedView, SafeArea, Tabs } from '@taroify/core';
import { View } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import { useEffect, useMemo, useState } from 'react';
import styles from './index.module.scss';

definePageConfig({
  navigationBarTitleText: '会员套餐',
});

const MemberPackage = () => {
  const { defaultSetting } = useStoreData(({ common }) => ({
    defaultSetting: common.defaultSetting,
  }));

  // 会员等级
  const [memberLevel, setMemberLevel] = useState(0);
  // 会员版本
  const [memberVersion, setMemberVersion] = useState(0);

  const memberPackage = useMemo(() => {
    if (defaultSetting.member_version) {
      const { member_version } = defaultSetting;
      // 数据处理
      return Object.keys(member_version).map((key) => {
        return {
          name: key,
          detail: member_version[key].map((item) => {
            item.name = item['版本名称'];
            item.price = item['单位价格'];
            item.content = item['版本介绍'];
            if (item['优惠提示']) {
              item.onSale = item['优惠提示'];
            }
            if (item['包含']) {
              item.right = Object.keys(item['包含']).map((rightKey) => {
                return {
                  rightName: rightKey,
                  detail: item['包含'][rightKey],
                };
              });
            }
            return item;
          }),
        };
      });
    }
    return [];
  }, [defaultSetting.member_version]);

  const handelSubmit = useMemoizedFn(() => {
    console.log('submit');
  });

  return (
    <View className={styles.container}>
      <ConfigProvider
        theme={{
          '-tab-font-size': '34rpx',
        }}
      >
        <Tabs value={memberLevel} onChange={setMemberLevel}>
          {memberPackage.map((member) => {
            return (
              <Tabs.TabPane title={member.name}>
                <ConfigProvider
                  theme={{
                    '-tab-font-size': '28rpx',
                  }}
                >
                  <Tabs value={memberVersion} onChange={setMemberVersion}>
                    {member.detail.map((version) => {
                      return (
                        <Tabs.TabPane title={version.name}>
                          <View className={styles.tabsContent}>
                            {/* 版本介绍 */}
                            <View>{version.content}</View>
                          </View>
                        </Tabs.TabPane>
                      );
                    })}
                  </Tabs>
                </ConfigProvider>
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      </ConfigProvider>

      <FixedView position="bottom">
        <View className={styles.controls}>
          <Button variant="contained" color="primary" shape="round" className={styles.button} onClick={handelSubmit}>
            订阅
          </Button>
        </View>
        <SafeArea position="bottom" />
      </FixedView>
    </View>
  );
};

export default MemberPackage;
