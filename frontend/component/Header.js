"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.css';
import React, { useContext } from 'react'
import { UserContext } from '@/context/Context';

const Header = () => {
  const [state,setState] = useContext(UserContext);
  const router = useRouter();
  if(state && state.token) router.push('/dashboard');
  const Logout = () =>{
    window.localStorage.removeItem("auth");
    router.push("/login");
    window.location.reload(true);
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-end px-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Navbar</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
            <ul className="navbar-nav">
              
              {state===null ? (<>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" href="/">Home</Link>
              </li>
                <li className="nav-item">
                  <Link className="nav-link" href="login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="register">Register</Link>
                </li>
                </>)
               :(<>
                  <li className="nav-item">
                    <Link className="nav-link" href="/dashboard">Feeds</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href="/user/profile">Profile</Link>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" style={{cursor:"pointer"}} onClick={Logout} >Logout</a>
                  </li>
                  </>
               )}
            </ul>

          </div>
        </div>
      </nav>
  )
}

export default Header
