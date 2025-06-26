import { useSelector } from 'react-redux';

import { isEqual } from 'lodash';

const defaultEqualityFn = (left: unknown, right: unknown) => isEqual(left, right);

/**
 * 二次封装的useSelector,为了类型提示方便
 * @param selector useSelector的回调
 * @returns selector 函数的返回值
 */
function useStoreData<S>(selector: (s: IState) => S, equalityFn: (left: S, right: S) => boolean = defaultEqualityFn) {
  return useSelector<IState, S>(selector, equalityFn);
}

export default useStoreData;
