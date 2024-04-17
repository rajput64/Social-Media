"use client"
import { LoadingOutlined } from '@ant-design/icons'
import React from 'react'

const Form = ({
    handleSubmit,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    setLoading,
    page,
    about,
    setAbout
}) => {
  return (
    <> 
            <form onSubmit={handleSubmit}>
                    {page !== "login" &&(
                        <div className="form-group">
                            <label className='text-muted mb-2'>Name</label>
                            <input type='text' onChange={(e)=>setName(e.target.value)} className='form-control' value={name} placeholder='Enter your name...'/>
                        </div>
                    )}
                       {page !=="login" && <div className="form-group mt-4">
                            <label className='text-muted mb-2'>About</label>
                            <input type='text' onChange={(e)=>setAbout(e.target.value)} className='form-control' value={about} placeholder='Tell something about yourself...'/>
                        </div>}
                        <div className="form-group mt-4">
                            <label className='text-muted mb-2'>Email</label>
                            <input type='email' onChange={(e)=>setEmail(e.target.value)} className='form-control' value={email} placeholder='Enter your email...' />
                        </div>

                        {page!== "userUpdate" && <div className="form-group mt-4">
                            <label className='text-muted mb-2'>Password</label>
                            <input type='password' onChange={(e)=>setPassword(e.target.value)} className='form-control' placeholder='Enter your password...'/>
                        </div>}

                        <div className="form-group mt-4">
                            {
                                page === "userUpdate" ? 
                                <button className="btn btn-primary col-12">{loading ? <LoadingOutlined/> : "Submit"}</button>
                                :
                            
                            <button disabled={page === "login" ? !email ||!password : !name || !email || !password } className="btn btn-primary col-12">{loading ? <LoadingOutlined/> : "Submit"}</button>
                        }
                        </div>
                    </form>
        </>
  )
}

export default Form
