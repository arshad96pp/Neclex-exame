import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react"
import { initialState, reducer } from "./reducer"
import { action } from "./action"
import axios from "axios"


const AppContext = createContext()
const AppContextProvider = ({ children }) => {


  const [state, dispatch] = useReducer(reducer, initialState)

  const stateItems = useMemo(() => [state, dispatch], [state])







  return (
    <AppContext.Provider value={{
      stateItems
    }}>

      {children}

    </AppContext.Provider>
  )
}






const useAppContext = () => {
  const { stateItems
  } = useContext(AppContext)

  if (!stateItems) {
    throw new Error('Somthing wrong')
  }
  const [state, dispatch] = stateItems

  const Actions = action(dispatch)

  return {
    state, Actions
  }

}

export { AppContextProvider, useAppContext }
