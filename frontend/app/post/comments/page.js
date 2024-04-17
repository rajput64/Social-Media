"use client"
import { UserContext } from '@/context/Context'
import React, { useContext } from 'react'

const page = () => {
const [state,setState] = useContext(UserContext);

    return (
    <UserContext>
      {JSON.stringify(state,null,4)}
    </UserContext>
  )
}

export default page
