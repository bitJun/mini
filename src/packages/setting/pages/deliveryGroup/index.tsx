import fetch from '@/lib/request';
import { useStoreData } from '@/store';
import { Button, Cell, Dialog, Empty, FixedView, Input, Popup, SafeArea } from '@taroify/core';
import { ScrollView, View, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAsyncEffect, useMemoizedFn } from 'ahooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.module.scss';

definePageConfig({
  navigationBarTitleText: '投放账号组',
  enableShareAppMessage: true,
});

const DeliverySetting = () => {
  const { defaultSetting } = useStoreData(({ common }) => ({
    defaultSetting: common.defaultSetting,
  }));
  const [deliverGroupList, setDeliverGroupList] = useState<Fetch.IGetDeliverGroupRes['records']>();
  const [accountList, setAccountList] = useState<Fetch.IGetAccountRes['records']>(); // 账号列表
  const [editAccountList, setEditAccountList] = useState<Fetch.IGetDeliverGroupAccountRes>(); // 选中列表
  const editGroupItem = useRef<Fetch.IDeliverGroupItem>();

  /** 分组操作 */
  const [name, setName] = useState<string>();
  const [open, setOpen] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<Fetch.IDeliverGroupItem>();
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleteItem, setDeleteItem] = useState<Fetch.IDeliverGroupItem>();
  const [accountOpen, setAccountOpen] = useState<boolean>(false);

  useEffect(() => {
    _getDeliverGroup();
  }, []);

  useAsyncEffect(async () => {
    const [result, error] = await fetch.getAccount({ fetch_all: true });
    if (error || !result) return;
    const formatResult = result.records.map((item) => {
      // @ts-ignore
      item.platformUrl = defaultSetting.deliver_platform.filter((i) => i.chineseName === item.platform)[0].url;
      return item;
    });
    setAccountList(formatResult);
  }, []);

  /** 待添加账号 */
  const notAccountList = useMemo(() => {
    if (!accountList) return [];
    if (!editAccountList) return accountList;
    return accountList.filter((item) => {
      return !editAccountList.some((i) => i.id === item.id);
    });
  }, [accountList, editAccountList]);

  /** 编辑分组账号 */
  const editGroupAccount = useMemoizedFn(async (item) => {
    editGroupItem.current = item;
    await _getDeliverGroupAccount();
    setAccountOpen(true);
  });

  /** 更新分组账号 */
  const updateGroupAccount = useMemoizedFn(async (type: 'add' | 'remove', item) => {
    if (!editAccountList || !editGroupItem.current) return;
    let accountIds = editAccountList.map((i) => i.id);
    switch (type) {
      case 'add':
        accountIds.push(item.id);
        break;
      case 'remove':
        accountIds = accountIds.filter((i) => i !== item.id);
        break;
      default:
        break;
    }
    // 发送更新请求
    const [result, error] = await fetch.updateDeliverGroupAccount({
      group_id: editGroupItem.current.id,
      account_ids: accountIds,
    });
    if (error || !result) return;
    Taro.showToast({ title: `${type === 'add' ? '添加' : '移除'}成功`, icon: 'none' });
    _getDeliverGroupAccount();
  });

  /** 取消分组编辑 */
  const cancelDialog = useMemoizedFn(() => {
    setName(''); // 清空输入框
    setOpen(false);
  });

  /** 新增/编辑分组 */
  const submitDialog = useMemoizedFn(async () => {
    if (!name) {
      Taro.showToast({ title: '请输入分组名称', icon: 'none' });
      return;
    }
    if (editItem) {
      // 编辑
      const [result, error] = await fetch.editDeliverGroup({ id: editItem.id, name });
      if (error || !result) return;
      Taro.showToast({ title: '编辑成功', icon: 'none' });
    } else {
      // 新增
      const [result, error] = await fetch.addDeliverGroup({ name });
      if (error || !result) return;
      Taro.showToast({ title: '新增成功', icon: 'none' });
    }
    setOpen(false);
    _getDeliverGroup();
  });

  /** 删除分组 */
  const deleteDialog = useMemoizedFn(async () => {
    if (!deleteItem) return;
    const [result, error] = await fetch.deleteDeliverGroup({ id: deleteItem.id });
    if (error || !result) return;
    Taro.showToast({ title: '删除成功', icon: 'none' });
    setDeleteOpen(false);
    _getDeliverGroup();
  });

  const _getDeliverGroup = useMemoizedFn(async () => {
    const [result, error] = await fetch.getDeliverGroup({ fetch_all: true });
    if (error || !result) return;
    setDeliverGroupList(result.records);
  });

  const _getDeliverGroupAccount = useMemoizedFn(async () => {
    if (!editGroupItem.current) return;
    const [result, error] = await fetch.getDeliverGroupAccount({ group_id: editGroupItem.current.id });
    if (error || !result) return;
    const formatResult = result.map((item) => {
      // @ts-ignore
      item.platformUrl = defaultSetting.deliver_platform.filter((i) => i.chineseName === item.platform)[0].url;
      return item;
    });
    setEditAccountList(formatResult);
  });

  return (
    <View className={styles.container}>
      <ScrollView scrollY className={styles.scrollView}>
        {deliverGroupList && deliverGroupList.length > 0 ? (
          <>
            {deliverGroupList.map((item) => {
              return (
                <View className={styles.listItem}>
                  <View>{item.name}</View>
                  <View className={styles.listControls}>
                    <View className={styles.listBtn} onClick={() => editGroupAccount(item)}>
                      账号管理
                    </View>
                    <View
                      className={styles.listBtn}
                      onClick={() => {
                        setName(item.name);
                        setEditItem(item);
                        setOpen(true);
                      }}
                    >
                      编辑
                    </View>
                    <View
                      className={styles.listBtn}
                      onClick={() => {
                        setDeleteItem(item);
                        setDeleteOpen(true);
                      }}
                    >
                      删除
                    </View>
                  </View>
                </View>
              );
            })}
          </>
        ) : (
          <Empty className={styles.empty}>
            <Empty.Image />
            <Empty.Description>暂无账号组</Empty.Description>
          </Empty>
        )}
      </ScrollView>
      <FixedView position="bottom">
        <View className={styles.controls}>
          <Button
            variant="contained"
            color="primary"
            shape="round"
            className={styles.button}
            onClick={() => {
              setName(undefined);
              setEditItem(undefined);
              setOpen(true);
            }}
          >
            新增账号组
          </Button>
        </View>
        <SafeArea position="bottom" />
      </FixedView>
      {/* 账号管理 */}
      <Popup open={accountOpen} rounded placement="bottom" className={styles.popup}>
        <View className={styles.popupBox}>
          <View className={styles.operatingArea}>
            <View className={styles.cancel}></View>
            <View className={styles.title}>账号管理</View>
            <View className={styles.confirm} onClick={() => setAccountOpen(false)}>
              <Popup.Close />
            </View>
          </View>
          <ScrollView scrollY className={styles.popupContent}>
            <Cell.Group title="组内账号列表">
              {editAccountList && editAccountList.length > 0 ? (
                editAccountList.map((item) => {
                  return (
                    <Cell
                      title={
                        <View className={styles.popupFlex}>
                          {/* @ts-ignore */}
                          <Image src={item.platformUrl} className={styles.platformIcon}></Image>
                          <View>{item.name}</View>
                        </View>
                      }
                    >
                      <View className={styles.textBtn} onClick={() => updateGroupAccount('remove', item)}>
                        移除
                      </View>
                    </Cell>
                  );
                })
              ) : (
                <Cell title="暂无账号"></Cell>
              )}
            </Cell.Group>
            <Cell.Group title="待添加账号列表">
              {notAccountList && notAccountList.length > 0 ? (
                notAccountList.map((item) => {
                  return (
                    <Cell
                      title={
                        <View className={styles.popupFlex}>
                          {/* @ts-ignore */}
                          <Image src={item.platformUrl} className={styles.platformIcon}></Image>
                          <View>{item.name}</View>
                        </View>
                      }
                    >
                      <View className={styles.textBtn} onClick={() => updateGroupAccount('add', item)}>
                        添加
                      </View>
                    </Cell>
                  );
                })
              ) : (
                <Cell title="暂无账号"></Cell>
              )}
            </Cell.Group>
          </ScrollView>
        </View>
      </Popup>
      {/* 新增/编辑分组 */}
      <Dialog open={open} onClose={cancelDialog}>
        <Dialog.Content>
          <Input value={name} onChange={({ detail }) => setName(detail.value)} placeholder="输入分组名称"></Input>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onClick={cancelDialog}>取消</Button>
          <Button onClick={submitDialog}>确认</Button>
        </Dialog.Actions>
      </Dialog>
      {/* 删除二次确认 */}
      <Dialog open={deleteOpen} onClose={setDeleteOpen}>
        <Dialog.Header>提示</Dialog.Header>
        <Dialog.Content>确认删除分组 {deleteItem?.name} 吗?</Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => setDeleteOpen(false)}>取消</Button>
          <Button onClick={deleteDialog}>确认</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

export default DeliverySetting;
