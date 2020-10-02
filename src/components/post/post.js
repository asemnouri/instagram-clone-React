import React, { useState,useEffect } from 'react'
import './post.css'
import Avatar from '@material-ui/core/Avatar'
import { db } from '../../firebase'
import firebase from 'firebase'

function Post({ imageUrl, caption, username, postId,user }) {
    const [comments, setComments] = useState([])//we are creating a comments collection for each post
    const [singleComment, setSingleComment] = useState('')

    useEffect(() => {//(like componentDidmount)when ever there is a change in the postId for a comment it will detect it
        let unsubscribe;
        if (postId) {
            unsubscribe = db.collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp','asc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map(doc => doc.data()))
                })
        }
        return () => {
            unsubscribe()
        }
    }, [postId])//this means if the vaiable changes the useEffect fires

    const postComment=(e)=>{
        e.preventDefault()
        db.collection('posts')
        .doc(postId)
        .collection('comments')
        .add({
            text:singleComment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            username:user.displayName//we need the user who is signed in not the post holder
        })
        setSingleComment('')
    }

    return (
        <div className="post">


            {/*header -> avatar+userNmae  */}

            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt={username}
                src={imageUrl}
                />
                <h3>{username}</h3>
            </div>

            {/* image */}
            <img className="post__image" src={imageUrl} alt=""></img>
            {/* username +caption */}
            {/* see the styles how to make it bold */}
            <h4 className="post__text"><strong>{username}:</strong>{caption}</h4>
           <div className="post__comments">
            {
                comments.map((comment)=>(
                <p>
                    <strong>{comment.username}</strong>{comment.text}
                </p>
                ))
            }
            </div>
            {/* this will hide the comment box if there was no user */}
            {user && (
                <form className="post__commentBox">
                <input
                className="post__input"
                placeholder="Add acomment..."
                value={singleComment}
                onChange={e=>setSingleComment(e.target.value)}
                />
                <button
                disabled={!singleComment}
                className="post__button"
                type="submit"
                onClick={postComment}
                >
                    Post
                </button>
            </form>
            )}
            
        </div>
    )
}

export default Post