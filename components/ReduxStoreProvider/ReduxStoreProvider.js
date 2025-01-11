"use client";

import store from "@/lib/store/store";
import { Provider } from "react-redux";

const ReduxStoreProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxStoreProvider;
