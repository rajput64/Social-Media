"use client"
import { UserContext } from '@/context/Context'
import { SyncOutlined } from '@ant-design/icons'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'


const UserRouter = ({children}) => {
    const [ok,setOk] = useState(false);
    const router = useRouter();
    const [state,setState] = useContext(UserContext);

    useEffect(()=>{
        if(state && state.token) getCurrentUser();
    },[state && state.token]);

    const getCurrentUser = async()=>{
        try {
            const { data } = await axios.get('http://localhost:8000/api/current-user', {
            headers: {
                'Authorization': `Bearer ${state.token}`, // Assuming you have the token stored somewhere
                'Content-Type': 'application/json', // Adjust content type as needed
                // Add other headers if required
            }
        });
            console.log(data,"from userrouter");
            if(data.ok) setOk(true);
        } catch (error) {
            console.log(error);
            router.push("/login");
        }
    }
    state === null && setTimeout(()=>{
        getCurrentUser()
    },100);
    
  return (
    !ok ? (<SyncOutlined spin className='d-flex justify-content-center display-1 text-primary p-5'/>) : (<>{children}</>)
  )
}

export default UserRouter
