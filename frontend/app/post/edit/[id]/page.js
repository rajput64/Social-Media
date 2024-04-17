"use client"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PostForm from '@/component/form/PostForm';
import { UserContext } from '@/context/Context';
import UserRouter from '@/routerContext/UserRouter';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'


const page = ({params}) => {
  const [state,setState] = useContext(UserContext);
  const id = params.id;
  const router = useRouter();
  const [content,setContent] = useState("");
  const [image, setImage] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [post,setPost] = useState({});
  const postSubmit = async(e)=>{
    e.preventDefault();
    try {
      const {data} = await axios.put(`/update-post/${id}`,{content,image});
      if(data.error){
        toast.error(data.error);
      }else{
        toast.success("post updated successfully!");
        router.push('/dashboard');
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    if(id) fetchPost();
},[id])


const fetchPost = async()=>{
    try {
        const {data} = await axios.get(`http://localhost:8000/api/user-post/${id}`);
        setPost(data);
        setContent(data.content);
        setImage(data.image);
        console.log(data,"data post");
    } catch (error) {
        console.log(error);
    }
}

  //Function to handle file upload
  const handleImage = async(e)=>{
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append("images",file);
    console.log([...formData]);
    setImageUploading(true);
    try {
      const {data} = await axios.post("/upload-image",formData);
      // console.log(data);
      setImage({
        url: data.url,
        public_id: data.public_id
      })
      setImageUploading(false);
    } catch (error) {
      console.log("error in post form file upload",error);
      setImageUploading(false);
    }
  }
  return (
    <UserRouter>
      <div className="container-fluid">
      <div className="row py-5 bg-secondary text-light">
        <div className="col">
          <h1 className='text-center fs-1'>Update Post</h1>
        </div>
      </div>
      <div className="container py-5">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <PostForm 
            content={content} 
            setContent={setContent} 
            postSubmit={postSubmit} 
            handleImage={handleImage} 
            image={image} 
            imageUploading={imageUploading}/>
            {/* <pre>{JSON.stringify(postsdata,null,4)}</pre> */}
          </div>
        </div>
      </div>
    </div>
    </UserRouter>
  )
}

export default page
