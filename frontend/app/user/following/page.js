"use client"
import UserImage from '@/component/UserImage'
import { UserContext } from '@/context/Context'
import UserRouter from '@/routerContext/UserRouter'
import { LoadingOutlined } from '@ant-design/icons'
import { Avatar, List, Spin } from 'antd'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'


const page = () => {
  const [state,setState] =useContext(UserContext);
  const [people,setPeople] = useState([]);
  const [loading,setLoading] = useState(true);

  const router = useRouter();
  
  useEffect(()=>{
    if(state && state.token) fetchFollowing();
  },[state && state.token])


  const imageSource = (user)=>{
    if(user.image){
      return user.image.url
    }else{
      return '/images/avatar.webp'
    }
  }

  const fetchFollowing = async()=>{
    try {
      setLoading(true);
      const {data} = await axios.get("/user-following");
      console.log(data,"following");
      setPeople(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

const handleFollow = async(user) =>{
  try {
    const {data} = await axios.put('/user-unfollow',{_id:user._id});

    //update localStorage
    let auth = JSON.parse(localStorage.getItem('auth'));
    auth.user = data;
    localStorage.setItem('auth',JSON.stringify(auth));
  
    //update context
    setState({...state,user:data});
    //remove the person once we follow
    let filtered = people.filter((p)=>p._id !== user._id);
    setPeople(filtered);

  } catch (error) {
    console.log(error);
  }
}

const handleUnfollow = async(user)=>{
  try {
    const {data} = await axios.put('/user-unfollow',{_id: user._id});
    let auth = JSON.parse(localStorage.getItem('auth'));
      auth.user = data;
      localStorage.setItem('auth',JSON.stringify(auth));
    
      //update context
      setState({...state,user:data});
      //remove the person once we follow
      let filtered = people.filter((p)=>p._id !== user._id);
      setPeople(filtered);
  } catch (error) {
    console.log(error);
  }
}
  return (
    <UserRouter>
      
      
      <div className=" col-md-6 offset-md-3">
        <h2 className='p-5'>Following</h2> 
        {loading ? <LoadingOutlined  className='d-flex justify-content-center display-1 text-primary p-5'/> : 
        (<List
            itemLayout='horizontal'
            dataSource={people}
            renderItem={(user) => (
              <List.Item key={user.name}>
                <List.Item.Meta
                  avatar={
                  <Avatar src={imageSource(user)}/>
                  // <UserImage user={user}/>
                }
                  title={user.name}
                />
                <span onClick={()=> handleUnfollow(user)} className='text-primary fs-6' style={{cursor:"pointer"}}>Unfollow</span>
                </List.Item>
            )}
          />)}
      </div>
      
    </UserRouter>
  )
}

export default page
