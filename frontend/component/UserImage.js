import { Avatar } from 'antd'
import React from 'react'

const UserImage = ({user}) => {
    const imageSrc = user && user.photo && user.photo.trim() !==''? user.photo:'images/avatar.png';
  return (
    <Avatar src={imageSrc}/>
  )
}

export default UserImage
