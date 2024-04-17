"use client"
import { CameraOutlined, LoadingOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';


const PostForm = ({content,setContent,postSubmit,image,imageUploading, handleImage}) => {

  return (
    <>
    <div className="card mb-3">
        <div className="card-body p-0">
            <div className="form-group">
                <form className="form-group p-1">
                    <ReactQuill theme="snow" className='form-control' value={content} onChange={(e)=>setContent(e)} placeholder='Write Something!' />
                </form>
            </div>
            <div className="card-footer d-flex justify-content-between">
                <button onClick={postSubmit} className='btn btn-primary btn-sm mt-1'>Post</button>
                <label>
                    {
                        image && image.url ? (<Avatar size={30} src={image.url} className='mt-1'/>) : imageUploading ? (<LoadingOutlined className="mt-2"/>) : <CameraOutlined className='mt-2'/>
                    }
                    <input type='file' onChange={handleImage} accept='image/*' hidden/>
                </label>
            </div>
        </div>
    </div> 
   
    </>
  )
}

export default PostForm
