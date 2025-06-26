const constants = { SET_STATE: 'SET_STATE' } as const;

export type IReducers<N extends IModulesMapKey> = {
  type: ValueOf<typeof constants>;
  namespace: N;
  state: Partial<IState[N]>;
};
const reducers = <N extends IModulesMapKey>(state = {} as IState, action: IReducers<N>) => {
  switch (action.type) {
    case constants.SET_STATE:
      if (action.namespace) {
        return {
          ...state,
          [action.namespace]: {
            ...state[action.namespace],
            ...action.state,
          },
        };
      }
      return { ...state };
    default:
      return state;
  }
};
export { constants, reducers };
