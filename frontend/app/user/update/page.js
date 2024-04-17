"use client"
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/reset.css'
import { Avatar, Modal, Spin } from 'antd'
import Link from 'next/link';

import { useRouter } from 'next/navigation';

import { CameraOutlined } from '@ant-design/icons';
import Form from '@/component/Form';
import UserRouter from '@/routerContext/UserRouter';
import { UserContext } from '@/context/Context';


const page = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(false);
    const [about, setAbout] = useState('');
    const [imageUploading, setImageUploading] = useState(false);
    const [image, setImage] = useState({});
    const router = useRouter()
    const [state, setState] = useContext(UserContext);

    useEffect(() => {
        if (state && state.user) {
            setName(state.user.name);
            setEmail(state.user.email);
            setAbout(state.user.about);
        }

    }, [state && state.user])
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const { data } = await axios.put(`/profile-update`, {
                name,
                email,
                about,
                password
            });

            let auth = JSON.parse(localStorage.getItem('auth'));
            auth.user = data;
            localStorage.setItem('auth',JSON.stringify(auth));

            setState({...state,user:data});

            setOk(true);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            toast.error(err.response.data);
        }
    }
    
    // console.log(state,"from update")
    const ImageUpload = async (e) => {
        // console.log(e.target.files[0]);
        const file = e.target.files[0];
        let formData = new FormData();
        formData.append("images", file);
        setImageUploading(true);

        try {
            // Upload image to Cloudinary
            const { data } = await axios.post("/profile-image", formData);

            //set photo in user auth
            let auth = JSON.parse(localStorage.getItem('auth'));
            auth.user = {
                ...auth.user, //parse existing user data
                photo: data.photo //Add the photo field
            };
            localStorage.setItem('auth', JSON.stringify(auth));

            // Update photo in context
            setState(prevState => ({
                ...prevState,
                user: {
                    ...prevState.user,
                    photo: data.photo
                }
            }));
            setImageUploading(false);
        } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
        }
    };
    console.log(state.user)
    return (
        <UserRouter>
            <div className="container-fluid">
                <div className="row py-5 bg-secondary text-light">
                    <div className="col text-center">
                        <h1 className='fs-1'>Profile update</h1>
                    </div>
                </div>
                <div className="row py-5">
                    <div className="col-md-6 offset-md-3">
                        <div className="col d-flex justify-content-center">
                            
                        
                            <label>
                            {imageUploading ? <Spin/> : (state.user && state.user.photo ? (<Avatar size={90} src={state.user.photo} />) : (<><span style={{ display: "flex", backgroundColor: "lightblue", width: "100px", height: "100px", borderRadius: "50%", textAlign: "center", justifyContent: "center" }}><CameraOutlined style={{ fontSize: "20px" }} /></span></>))}
                                
                                {/* <Avatar size={30} src="/images/avatar.webp"/> */}
                                <input type='file' onChange={(e) => ImageUpload(e)} accept='image/*' hidden />
                            </label>
                        </div>
                        <p className='text-center my-4 fw-bold'  style={{color:"rgb(123, 119, 119)"}}>{state.user && state.user.about && state.user.about }</p>
                        <Form
                            handleSubmit={handleSubmit}
                            name={name}
                            page="userUpdate"
                            setName={setName}
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                            loading={loading}
                            profileUpdate={true}
                            about={about}
                            setAbout={setAbout}
                        />
                    </div>
                        <Link href="/user/resetPassword" className='mt-4 text-center' style={{textDecoration: "none"}}>Reset Your Password</Link>
                </div>
                {/* sucessfully login*/}
                <div className="row">
                    <div className="col">
                        <Modal
                            title="Data successfully updated!"
                            open={ok}
                            onCancel={() => setOk(false)}
                            footer={null}
                        >
                            {/* <Link href='/login' className='btn btn-primary btn-sm'>
                            Login
                        </Link> */}
                        </Modal>
                    </div>
                </div>
            </div>

        </UserRouter>
    )
}

export default page
