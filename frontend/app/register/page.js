"use client"
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { ToastContainer ,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/reset.css'
import {Modal} from 'antd'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/Context';
import Form from '@/component/Form';


const page = () => {
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('');
    const [about,setAbout] = useState('');
    const [ok,setOk] = useState(false);
    const [loading,setLoading] = useState(false);

    const router = useRouter()
    const [state,setState] = useContext(UserContext)

    const handleSubmit = async(e)=>{
        e.preventDefault()
        console.log(name,email,password)
        try{
            setLoading(true)
            const {data} =await axios.post(`http://localhost:8000/api/register`,{
                name,
                email,
                about,
                password
            });
            setOk(true);
            setName('');
            setEmail('');
            setPassword('');
            setLoading(false)
        }catch(err){
            setLoading(false);
            console.log(err.response.data,"eeeeeeee");
            toast.error(err.response.data);

        }
    }
    if(state && state.token) router.push('/dashboard')
  return (
    <>
        <div className="container-fluid">
            <div className="row py-5 bg-secondary text-light">
                <div className="col text-center">
                    <h1 className='fs-1'>Register</h1>
                </div>
            </div>
            <div className="row py-5">
                <div className="col-md-6 offset-md-3">  
                    <Form
                        handleSubmit={handleSubmit}
                        name={name}
                        setName={setName}
                        email={email}
                        setEmail={setEmail}
                        about={about}
                        setAbout={setAbout}
                        password={password}
                        setPassword={setPassword}
                        loading={loading}
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
                        <Link href='/login' className='btn btn-primary btn-sm'>
                            Login
                        </Link>
                    </Modal>
                </div>
            </div>
        </div>
        
    </>
  )
}

export default page
