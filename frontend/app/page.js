"use client"
import React from 'react'

const page = () => {
  return (
    <div className="container-fluid" 
    style={{padding: '0', }}>
    <img src='/images/home.jpg' alt="banner image" style={{ width: "100%", height: "80vh", objectFit: "cover" }} />

    <div className="container mt-4 align-self-center" style={{height:"60vh",display:"flex",flexDirection: "column",alignItems: "center",justifyContent:"center"}}>
      <h2 className='text-center'>Enjoy connectiong with your favourite star</h2>
      <p className='text-center' style={{color: "#8d9597"}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde optio ullam impedit nam asperiores consequuntur deleniti facere, error possimus, perspiciatis perferendis maxime praesentium sint consectetur. Doloremque, nostrum! Mollitia, ullam nesciunt.</p>
      <div className="buttons text-center mt-5">
        <button className='btn btn-primary' style={{border:'none', background: 'rgb(168,163,28)',
          background: 'linear-gradient(90deg, rgba(168,163,28,0.794537798029368) 0%, rgba(166,11,175,0.9009803750601804) 43%, rgba(32,0,255,0.7609243526512167) 100%)' }}>Download App</button>
        <button className='btn btn-primary mx-2' style={{border:'none', background: 'rgb(168,163,28)',
         background: 'linear-gradient(90deg, rgba(168,163,28,0.794537798029368) 0%, rgba(166,11,175,0.9009803750601804) 43%, rgba(32,0,255,0.7609243526512167) 100%)',Onhover: "red"}}>Rate Us</button>
      </div>
    </div>
</div>
  
  )
}

export default page
