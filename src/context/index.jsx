import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { initialState, reducer } from "./reducer";
import { action } from "./action";
import axios from "axios";

const AppContext = createContext();
const AppContextProvider = ({ children }) => {
  const [globelSelecte, setGlobelSelecte] = useState({});
  const [state, dispatch] = useReducer(reducer, initialState);

  const stateItems = useMemo(() => [state, dispatch], [state]);

  return (
    <AppContext.Provider
      value={{
        stateItems,
        globelSelecte,
        setGlobelSelecte,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  const { stateItems, globelSelecte, setGlobelSelecte } =
    useContext(AppContext);

  if (!stateItems) {
    throw new Error("Somthing wrong");
  }
  const [state, dispatch] = stateItems;

  const Actions = action(dispatch);

  return {
    state,
    Actions,
    globelSelecte,
    setGlobelSelecte,
  };
};

export { AppContextProvider, useAppContext };
