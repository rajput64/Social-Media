"use client"
import UserImage from '@/component/UserImage';
import { UserContext } from '@/context/Context';
import UserRouter from '@/routerContext/UserRouter';
import { DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Avatar } from 'antd';
import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import renderHTML from 'react-render-html';


const page = () => {
    const [state,setState] = useContext(UserContext);
    const [userdata,setUserData] = useState([]);
    const [posts,setPosts] = useState([]);
    useEffect(()=>{
      if(state && state.token) fetchFollowers();
      allpostofuser();
    },[state && state.token]);
    const fetchFollowers = async()=>{
      try {
        const {data} = await axios.get("/userData");
        setUserData(data.user);
      } catch (error) {
        console.log(error);
      }
    }

    const imageSource = (user)=>{
      if(user.image){
        return user.image.url
      }else{
        return '/images/avatar.webp'
      }
    }
    const allpostofuser = async()=>{
      try {
        const {data} = await axios.get("/allpostbyuser");
        console.log(data,"allpostbyuser");
        setPosts(data);
      } catch (error) {
        console.log(error);
      }
    }
    //delete post
    const handleDeletePost = async(post)=>{
      try {
        const answer = window.confirm("Are you Sure!");
        if(!answer) return;
        const {data} = await axios.delete(`/delete-post/${post._id}`);
        toast.success("Post Deleted");
        allpostofuser();
      } catch (error) {
        toast.error("Try after sometime.")
      }
    }
    return (
    <UserRouter>
        {/* {JSON.stringify(userdata,null,4)}
        {JSON.stringify(posts,null,4)} */}
      <div className="container mt-5">
        <div className="row">
          <div className="col-4 border border-2 rounded-1 p-4" style={{height: "40rem"}}>
            <span className=''>
            {/* <Avatar size={100} src={<UserImage user={userdata}/>}/>
             */}
             <Avatar src={imageSource(userdata)} size={150}/>
             
            <p className='mt-4 fw-bold fs-3'>{userdata.name}</p>
            <p className='fs-5 border-bottom'><Link href="/user/followers" style={{textDecoration:"none"}}> Followers {userdata.Followers ? userdata.Followers.length : 0}</Link></p>
            <p className='fs-5 border-bottom'><Link href="/user/following" style={{textDecoration:"none"}}>Following {userdata.following ? userdata.following.length : 0}<link/></Link></p>
            <p className='fs-5 border-bottom'>{userdata.about && userdata.about}</p>
            <p className='text-center d-flex justify-content-between mt-8'><Link href="/user/resetPassword">Reset Password</Link> <Link href="/user/update"><SettingOutlined/></Link></p>
            </span>
          </div>
          <div className="col">
            {posts && posts.map((post)=>
              <div className="card mb-3">
                  <div className="card-header">
                    <div className="row">
                      <div className="col">
                        <Avatar src={imageSource(userdata)} size={30}/>
                        <span className="p-2 ml-3">{userdata.name}</span>
                        <span className="pt-2 ml-3">{moment(post.createdAt).fromNow()}</span>
                      </div>
                      <div className="col text-right" style={{textAlign: "right"}}> 
                        <DeleteOutlined className="text-danger h5" onClick={()=>handleDeletePost(post)} style={{cursor:"pointer"}}/>
                      </div>
                    </div>    
                  </div>
                  <div className="card-body">
                    <div>{renderHTML(post.content)}</div>
                  </div>
                  <div className="card-footer">
                    {post.image && (
                      <div style={{
                        backgroundImage: "url("+ post.image.url + ")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center center",
                        objectFit: "cover",
                        height: "300px"
                      }}>
                    </div>
                    )}
                  </div>
                  <p className='p-2 border-bottom'>Comments</p>
                  <span>
                    
                    {post.comments && post.comments.length >0 ? (post.comments && post.comments.slice()
                    .sort((a,b) => new Date(b.created) - new Date(a.created))
                    .map((comment)=>(
                      <div className="d-flex flex-column justify-content-end p-2 border-bottom">
                        <div className="col-10"><UserImage user={comment.postedBy} />{comment.text}</div>
                      </div>
                    ))
                    )
                  :
                  (<p className='px-2'>No comments to show.</p>)
                  }
                  </span>
              </div>
            )}
            
          </div>
          
        </div>
      </div>
    </UserRouter>
  )
}

export default page

