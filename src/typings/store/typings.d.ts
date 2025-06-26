import { IModulesMap } from '@/store';

/** 全局声明 */
declare global {
  namespace StoreState {}

  // store命名空间列表
  type IModulesMapKey = 'common' | 'user' | 'delivery';
  // store中state的类型
  type IState = {
    [k in IModulesMapKey]: IModulesMap[k]['state'];
  };
  // 获取store中action的第一个参数
  type IActionArgs<N extends IModulesMapKey> = {
    setState: <SN extends IModulesMapKey = N>(state: Partial<IState[SN]>, otherNamespace?: SN) => void;
    getState: () => IState;
  };
  // store中action的类型
  type IAction = IActionTree['common'] & IActionTree['user'] & IActionTree['delivery'];
}

type IActionFunc<P extends [], R> = P extends [] ? () => R : (...p: P) => R;
type IActionItem<T extends IModulesMapKey> = {
  [K in keyof IModulesMap[T]['actions']]: IActionFunc<
    // @ts-ignore
    OtherParameters<IModulesMap[T]['actions'][K]>,
    // @ts-ignore
    ReturnType<IModulesMap[T]['actions'][K]>
  >;
};
type IActionTree = {
  [k in IModulesMapKey]: IActionItem<k>;
};
