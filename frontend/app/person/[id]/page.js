import { UserContext } from '@/context/Context';
import React, { useContext } from 'react'

const page = ({params}) => {
  const [state,setState] = useContext(UserContext);
  const id= params.id;
  return (
    <div>
      {id}
    </div>
  )
}

export default page
