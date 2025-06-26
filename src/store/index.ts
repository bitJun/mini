import { createStores, initialState, createActions } from './tools';
import { constants } from './reducers';
import useStoreData from './useStoreData';

import { constants as commonConstants, common } from './modules/common';
import { constants as userConstants, user } from './modules/user';
import { constants as deliveryConstants, delivery } from './modules/delivery';

// 创建模块集合
const modulesMap = { common, user, delivery };

// 创建常量集合
const storeEnv = {
  ...commonConstants,
  ...userConstants,
  ...deliveryConstants,
};

// 创建store
const store = createStores();

// 初始化数据
initialState(store, modulesMap);

export type IModulesMap = typeof modulesMap;

export type IModulesKeys = keyof IModulesMap;

// 初始化actionMap
const actionMap = createActions(modulesMap, store);

/** 调用 actions */
const storeActions = async <T extends keyof IAction>(name: T, ...params: Parameters<IAction[T]>) => {
  // @ts-ignore
  return store.dispatch<ReturnType<IAction[T]>>(actionMap[name](...params));
};

/**
 * 调用 指定 namespace 的 SET_STATE
 * @param namespace store的命名空间
 * @param state 第一个参数中命名空间中的可选数据
 * @returns 加入成功的数据
 */
const storeDispatch = <T extends IModulesMapKey>(namespace: T, state: Partial<IState[T]>) => {
  if (!namespace) return;
  return store.dispatch({ type: constants.SET_STATE, namespace, state });
};

export { store, storeEnv, storeActions, storeDispatch, useStoreData };
