import { configureStore } from "@reduxjs/toolkit";
import { HYDRATE, createWrapper } from "next-redux-wrapper";

import reducers from "./reducers/redcuers";

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      ...action.payload,
    };
    if (state.count) nextState.count = state.count;
    return nextState;
  } else {
    return reducers(state, action);
  }
};

const initStore = () => {
  return configureStore({
    reducer,
    devTools: process.env.NODE_ENV !== "production" ? false : true,
  });
};

//export type AppDispatch = typeof wrapper.withRedux.dispatch;
export type RootState = ReturnType<typeof reducers>;
export const wrapper = createWrapper(initStore);
