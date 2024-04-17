"use client"
import Form from '@/component/Form';
import { UserContext } from '@/context/Context';
import { Modal } from 'antd';
import axios from 'axios';
import { redirect, useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const page = () => {
    const [state,setState] = useContext(UserContext);
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [ok , setOk] = useState(false);
    const [loading,setLoading] = useState(false);


    const router = useRouter();
    if(state && state.token) router.push('/');
    const handleSubmit = async(e)=>{
        e.preventDefault();
        setLoading(true);
        try {
            const {data} = await axios.post('http://localhost:8000/api/login',{
                name,
                email,
                password
            });
            setState({
                user:data.user,
                token:data.token
            });
            window.localStorage.setItem("auth", JSON.stringify(data));
            // console.log(data,"login success")
            setLoading(false);

            router.push("/dashboard");
        } catch (error) {
            setLoading(false);
            console.log("Login error",error.response.data);
            toast.error(error.response.data);            
        }
    }
  return (
    <>
    {/* <h1>{JSON.stringify(state)}</h1> */}
      <div className="container-fluid">
          <div className="row py-5 bg-secondary text-light">
              <div className="col text-center">
                  <h1 className='fs-1'>Login</h1>
              </div>
          </div>
          <div className="row py-5">
              <div className="col-md-6 offset-md-3">  
                  <Form
                      handleSubmit={handleSubmit}
                      email={email}
                      setEmail={setEmail}
                      password={password}
                      setPassword={setPassword}
                      loading={loading}
                      page={"login"}
                  />
              </div>
          </div>
          {/* sucessfully login*/}
          <div className="row">
              <div className="col">
                  <Modal
                  title="Congratulation"
                  open={ok}
                  onCancel={()=>setOk(false)}
                  footer={null}
                  >
                      {/* <Link href='/login' className='btn btn-primary btn-sm'>
                          Login
                      </Link> */}
                  </Modal>
              </div>
          </div>
          <div className="row justify-content-md-center ">
            <div className="col-3 ">
                <p className='text-center'>Forgot password <a href="reset-password" className='text-primary '><u>Click Here</u></a></p>
            </div>
          </div>
      </div>
      
  </>
  )
}

export default page
