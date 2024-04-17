"use client"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { createContext, useEffect, useState } from 'react'

 const UserContext = createContext();

const UserProvider = ({children}) => {
    const [state,setState] = useState({
        user: {},
        token: ""
    });
    useEffect(()=>{
        setState(JSON.parse(window.localStorage.getItem("auth")));
    },[]);
    
   //Adding headers and baseurl in axios config
   const token = state && state.token ? state.token : "";
   axios.defaults.baseURL = process.env.NEXT_PUBLIC_API
   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
   const router = useRouter();
  //Add a request interceptor
  axios.interceptors.response.use(function (response) {
    // Do something before request is sent
    return response;
  }, function (error) {
    // Do something with request error
    if(error.response.status == 401 && req.config && !response.config._isRetryRequest){
      setState(null);
    window.localStorage.removeItem("auth");
    router.push('/login');
    }
    return Promise.reject(error);
  });
    return (
    <>
      <UserContext.Provider value={[state,setState]}>
        {children}
      </UserContext.Provider>
      </>
  )
}

export {UserContext,UserProvider};
