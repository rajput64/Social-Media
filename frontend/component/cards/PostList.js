import moment from 'moment'
import renderHTML from 'react-render-html';
import UserImage from '../UserImage';
import { CommentOutlined, DeleteFilled, DeleteOutlined, EditOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
import React, { useContext } from 'react';
import { UserContext } from '@/context/Context';
import { useRouter } from 'next/navigation';


const PostList = ({posts,handleDislike,handleLike,handleDeletePost,handleComment,handleDeleteComment}) => {
    const [state,setState] = useContext(UserContext);
    const router = useRouter();
    return (
    <>
    {posts && posts.map((post)=>
      <div className="card mb-3" key={post._id}>
          <div className="card-header">
              <div>
                  {/* <Avatar>{post.postedBy.name[0]}</Avatar> */}
                  <UserImage user={post.postedBy}/>
                  <span className="p-2 ml-3">{post.postedBy.name}</span>
                  <span className="pt-2 ml-3">{moment(post.createdAt).fromNow()}</span>
              </div>

          </div>
          <div className="card-body">
              <div>{renderHTML(post.content)}</div>
          </div>
          <div className="card-footer">
             {post.image && (
              <div style={{
                backgroundImage: "url("+ post.image.url + ")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                objectFit: "cover",
                height: "300px"
              }}>
              </div>
             )}
             <div className="d-flex align-items-center mt-2">
                {post.likes.includes(state.user._id)?
                (<HeartFilled onClick={()=> handleDislike(post._id)} className="text-danger pt-2 h5"/>): 
                (<HeartOutlined onClick={()=> handleLike(post._id)} className="text-danger pt-2 h5"/>)
                }
                
                <div className='' style={{marginLeft: ".4rem"}}>{post.likes.length} likes</div>
                <CommentOutlined onClick={()=>handleComment(post)} className="text-danger  pt-2 h5" style={{marginLeft: "1rem"}}/>
                   
               
                
                <div className=' mx-auto'>
                {state && state.user && state.user._id === post.postedBy._id &&(
                  <>
                    <EditOutlined className="text-danger  mx-auto h5" onClick={()=>router.push(`/post/edit/${post._id}`)} style={{marginLeft: "1rem"}}/>
                    <DeleteOutlined className="text-danger  h5" onClick={()=>handleDeletePost(post)} style={{marginLeft: "1rem"}}/>
                  </>
                )}
                </div>
             </div>
          </div>
           <p className=' p-2 border-bottom font-weight-bold' style={{fontWeight: "600"}}>Comments</p>       
          {post.comments && post.comments.length > 0 ? (post.comments && post.comments.slice()
          .sort((a,b)=>new Date(b.created) - new Date(a.created))
          // .slice(0, 2)
          .map((comment)=>(
              <div className="d-flex justify-content-end p-2 border-bottom">
                <div className="col-10" ><UserImage user={comment.postedBy} style={{marginRight:"4px"}}/>{comment.text}</div>
                <div className=" col-2 d-flex align-items-center  justify-content-between">{moment(comment.created).fromNow()} 
              
                {state && state.user && state.user._id === comment.postedBy._id &&(
                  <DeleteFilled onClick={()=>handleDeleteComment(post._id,comment)} className='align-items-end'/>
                )}
                </div>
              </div>
            ))
          ):(
            <p className='text-center my-2'>Be the first to comment.</p>
          )
        }
          {/* <div className="d-flex justify-content-end p-2 border-bottom">
              <div className="col-10" ><Avatar/>{JSON.stringify(post.comments.text)}</div>
              <div className="col-2" >date</div>
          </div>
          <div className="d-flex justify-content-end p-2 border-bottom">
              <div className="col-10" ><Avatar/>Comment</div>
              <div className="col-2" >date</div>
          </div> */}
      </div>
    )}
  </>
  )
}

export default PostList
