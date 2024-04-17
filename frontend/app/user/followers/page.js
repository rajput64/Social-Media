"use client"
import UserImage from '@/component/UserImage'
import { UserContext } from '@/context/Context'
import UserRouter from '@/routerContext/UserRouter'
import { LoadingOutlined } from '@ant-design/icons'
import { Avatar, List } from 'antd'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'


const page = () => {
    const [state,setState] = useContext(UserContext);
    const [people,setPeople] = useState([]);
    const [loading,setLoading] = useState(false);
    
    useEffect(()=>{
        if(state && state.token) fetchFollowers();
      },[state && state.token])

    const imageSource = (user)=>{
        if(user.image){
          return user.image.url
        }else{
          return '/images/avatar.webp'
        }
      }

    const fetchFollowers = async()=>{
        try {
          setLoading(true);
          const {data} = await axios.get("/user-followers");
          console.log(data,"followers");
          setPeople(data);
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      }
  return (
    <UserRouter>
      <div className=" col-md-6 offset-md-3">
        <h2 className='p-5'>Followers</h2> 
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
                </List.Item>
            )}
          />)}
      </div>
    </UserRouter>
  )
}

export default page
