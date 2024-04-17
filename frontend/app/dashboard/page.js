"use client"
import People from '@/component/cards/People'
import PostList from '@/component/cards/PostList'
import PostForm from '@/component/form/PostForm'
import { UserContext } from '@/context/Context'
import UserRouter from '@/routerContext/UserRouter'
import { Modal } from 'antd'
import axios from 'axios'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const page = () => {

const [state,setState] = useContext(UserContext);
const [content, setContent] = useState('');
const [postdata,setPostdata] = useState([]);
const [modalVisible, setModalVisible] = useState(false);
const [comment, setComment] = useState('');
const [currentPost,setCurrentPost] = useState({});
const [image,setImage] = useState({});
const [imageUploading,setImageUploading] = useState(false);
const [people ,setPeople] = useState([]);


const fetchUserPosts = async()=>{
  try {
    const {data} = await axios.get("http://localhost:8000/api/user-posts");
    setPostdata(data);
    console.log(data,"from dashboard");
  } catch (error) {
    console.log(error);
  }
}
useEffect(()=>{
  if(state && state.token){
    fetchUserPosts();
    findPeople();
  }
},[state && state.token]);
// fetchUserPosts();

//find people not following
const findPeople = async() =>{
  try {
    const { data } = await axios.get("http://localhost:8000/api/find-people");
    setPeople(data);
  } catch (error) {
    console.log(error);
  }
}

//submit post 
const postSubmit = async(e)=>{
e.preventDefault();
// console.log("post",content);
try {
  const {data} = await axios.post('http://localhost:8000/api/create-post',{content,image});
  if(data.error){
    toast.error(data.error);
  }else{
    toast.success("Post Created!");
    fetchUserPosts();
  }
} catch (error) {
  console.log(error,"while submitting post!");
}
}

//delete post
const handleDeletePost = async(post)=>{
  // console.log(post,"handle delete post");
  try {
    const answer = window.confirm("Are you Sure!");
    if(!answer) return;
    const {data} = await axios.delete(`http://localhost:8000/api/delete-post/${post._id}`);
    toast.error("Post Deleted");
    fetchUserPosts();
  } catch (error) {
    toast.error("Try after sometime.")
  }
} 

//delete comment
const handleDeleteComment = async(post,comment)=>{
  // console.log(post,comment,"cccccccccc");
  try {
    const {data} = await axios.delete("/remove-comment",{
      data:{
        postId: post,
        comment
      }
    });
    // console.log(data);
    toast.success("Comment deleted successfully!");
    fetchUserPosts();
  } catch (error) {
    toast.error("something went wrong!");
  }
  
}

//liking on post
const handleLike = async(_id)=>{
  try {
    const {data} = await axios.put('http://localhost:8000/api/like-post',{_id});
    fetchUserPosts();
  } catch (error) {
    console.log(error);
  }
}
//dislike post
const handleDislike = async(_id)=>{
  try {
    const {data} = await axios.put('http://localhost:8000/api/dislike-post',{_id});
    fetchUserPosts();
  } catch (error) {
    console.log(error);
  }
}
//show popup modal
const handleComment = async(post)=>{
  setModalVisible(true);
  setCurrentPost(post);
}
//post comment to db
const addComment = async(e)=>{
  e.preventDefault();
  try {
    const {data} = await axios.put("http://localhost:8000/api/add-comment",{
      postId: currentPost._id,
      comment,
    },{
      headers: {
        'Authorization': `Bearer ${state.token}`, // Assuming you have the token stored somewhere
        'Content-Type': 'application/json', // Adjust content type as needed
    }
    },{new:true},);
    setComment("");
    setModalVisible(false);
    fetchUserPosts();
  } catch (error) {
    console.log(error);
  }
}

//follow user
const handleFollow = async(user)=>{
  try {
    const { data } = await axios.put('http://localhost:8000/api/user-follow', { _id: user._id });

    //update localStorage
    let auth = JSON.parse(localStorage.getItem('auth'));
    auth.user = data;
    localStorage.setItem('auth', JSON.stringify(auth));

    //update context
    setState({ ...state, user: data });
    //remove the person once we follow
    let filtered = people.filter((p) => p._id !== user._id);
    setPeople(filtered);

    toast.success(`following ${user.name}`);

    //render the post to show post of user we follow

    fetchUserPosts();
  } catch (error) {
    console.log(error)
  }
}

//submitting imag on post
const handleImage = async(e) =>{
  const file = e.target.files[0];
  let formData = new FormData();
  formData.append("images",file);
  console.log([...formData]);
  setImageUploading(true);

  try {
    const {data} = await axios.post("http://localhost:8000/api/upload-image", formData);
    setImage({
      url: data.url,
      public_id: data.public_id
    });
    setImageUploading(false);
  } catch (error) {
    console.log("error in post form file upload", error);
    setImageUploading(false);
  }
}

    return (
    <UserRouter>
        <div className="container-fluid">
          <div className="row py-5 bg-secondary text-light">
            <div className="col">
              <div className="text-center fs-1">Newsfeed</div>
            </div>
          </div>
          <div className="container py-5">
            <div className="row">
              <div className="col-md-8">
                <PostForm content={content} setContent={setContent} postSubmit={postSubmit} image={image} imageUploading={imageUploading} handleImage={handleImage}/>
                <PostList posts={postdata} handleDeletePost={handleDeletePost} handleDislike={handleDislike} handleLike={handleLike} handleComment={handleComment} handleDeleteComment={handleDeleteComment}/>
              </div>
              <div className="col-md-4">
              {state && state.user && state.user.following && <Link href="/user/following" className='text-primary'>
                {state.user.following.length} Following
              </Link>}
                <People people={people} handleFollow={handleFollow}/>
              </div>
            </div>
          </div>
        </div>
        <Modal title="Comments" open={modalVisible} onCancel={()=>setModalVisible(false)} footer={null}>
          <form onSubmit={addComment}>
            <input type='text' className='form-control'placeholder="Comment on post" value={comment} onChange={(e)=>setComment(e.target.value)}/>
            <button className='btn btn-primary'>Comment</button>
          </form>
        </Modal>
    </UserRouter>
  )
}

export default page
