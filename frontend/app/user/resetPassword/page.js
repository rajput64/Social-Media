"use client"
import { UserContext } from '@/context/Context';
import { LoadingOutlined } from '@ant-design/icons';
import { ToastContainer ,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import React, { useContext, useState } from 'react'


const page = () => {
    const [state,setState] = useContext(UserContext);
    const [currentpassword, setCurrentpassword] = useState("");
    const [newpassword, setNewpassword] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");
    const [loading,setLoading] = useState(false);
    
    const handleSubmit = async(e)=>{
      e.preventDefault();
      if(newpassword !== confirmpassword){
        toast.error("password not match");
        return
      }
      try {
        const {data} = await axios.post("http://localhost:8000/api/reset-password",{
        currentpassword,newpassword,confirmpassword
      });
      toast.success(data)
      setCurrentpassword("");
      setNewpassword("");
      setConfirmpassword("");
      } catch (error) {
        console.log(error.response.data);
        toast.error(error.response.data);
      }
    }

  return (
    <>
      <div className="container-fluid ">
      <div className="row py-5 text-dark">
            <div className="col">
              <div className="text-center fs-2">Reset Password</div>
            </div>
        </div>
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form method='POST' onSubmit={handleSubmit}>
                        <div className="form-group mt-4">
                            <label className='text-muted mb-2'>Current Password</label>
                            <input type='password' className='form-control' value={currentpassword} onChange={(e)=>setCurrentpassword(e.target.value)} placeholder='Enter your current Password' />
                        </div>
                        <div className="form-group mt-4">
                            <label className='text-muted mb-2'>New Password</label>
                            <input type='password' className='form-control' value={newpassword} onChange={(e)=>setNewpassword(e.target.value)} placeholder='Enter your current Password' />
                        </div>
                        <div className="form-group mt-4">
                            <label className='text-muted mb-2'>Confirm Password</label>
                            <input type='password' className='form-control' value={confirmpassword} onChange={(e)=>setConfirmpassword(e.target.value)} placeholder='Enter your current Password' />
                        </div>
                        <div className="form-group mt-4">
                            <button disabled={!currentpassword ||!newpassword || !confirmpassword} className="btn btn-primary col-12">{loading ? <LoadingOutlined/> : "Submit"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
       
      </div>
    </>
  )
}

export default page
