import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { IModulesKeys, IModulesMap } from './index';
import { IReducers, reducers } from './reducers';

/**
 * @description: 创建store
 * @function 创建中间件 创建strore
 */
export const createStores = () => {
  // 创建中间件
  const middlewares = [ReduxThunk];
  // 创建store
  return createStore<IState, IReducers<IModulesMapKey>, {}, {}>(
    reducers,
    applyMiddleware<IReducers<IModulesMapKey>>(...middlewares),
  );
};

/**
 * @description: 初始化数据
 * @function 初始化每一个store中的state
 */
export const initialState = (store: ReturnType<typeof createStores>, modulesMap: IModulesMap) => {
  Object.keys(modulesMap).forEach((namespace: IModulesKeys) => {
    store.dispatch({ type: 'SET_STATE', namespace, state: modulesMap[namespace].state });
  });
};
/**
 * @description: 初始化actions
 * @function 初始化每一个store中的actions
 */
export const createActions = (modulesMap: IModulesMap, store: ReturnType<typeof createStores>) => {
  let actions = {};
  Object.keys(modulesMap).forEach((namespace: IModulesKeys) => {
    // 设置数据
    const setState = <N extends typeof namespace>(state: IState[N], otherNamespace?: N) => {
      store.dispatch({ type: 'SET_STATE', namespace: otherNamespace || namespace, state });
    };
    const defaultStore = { setState, getState: store.getState, dispatch: store.dispatch };
    const oldActions = modulesMap[namespace].actions;
    const newActions: Partial<typeof oldActions> = {};
    Object.keys(oldActions).forEach((actionsName) => {
      // @ts-ignore
      newActions[actionsName] = (params: Parameters<(typeof oldActions)[typeof actionsName]>) => () => {
        return oldActions[actionsName](defaultStore, params);
      };
    });
    actions = { ...actions, ...newActions };
  });
  return actions as IAction;
};
