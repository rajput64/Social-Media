import UserRouter from '@/routerContext/UserRouter'
import { Avatar, List } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'
import UserImage from '../UserImage'
import Link from 'next/link'
import { UserContext } from '@/context/Context'


const People = ({people, handleFollow}) => {
    const[state,setState]= useContext(UserContext);
    const router=useRouter();
  return (
    <>
    <List
        itemLayout='horizontal'
        dataSource={people}
        renderItem={(user)=>(
            <List.Item key={user.name} className='fw-bold' style={{cursor:"pointer", textDecoration:"none"}}>
                <Link href={`/person/${user._id}`} >
                    <List.Item.Meta
                        avatar={<UserImage user={user}/>}
                        title={user.name}
                        style={{textDecoration:"none"}}
                    />
                </Link>
                <span onClick={()=>handleFollow(user)} className='text-primary fs-6' >Follow</span>
            </List.Item>
        )}
    />
    </>
  )
}

export default People
