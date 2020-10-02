import React, { useState, useEffect } from 'react';
import './App.css';
import { db, auth } from './firebase'

import Post from './components/post/post'
import ImageUpload from './components/imageUpload/ImageUpload'

import { Button, makeStyles, Input } from '@material-ui/core';
import Modal from '@material-ui/core/Modal'
import InstagramEmbed from "react-instagram-embed"


//material UI styling
function getModalStyle() {
  const top = 50
  const left = 50
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%,-${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}))

function App() {
  //material UI
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)//opens the sing-up modal
  const [openSignin, setOpenSignin] = useState(false)//opens the sing-in modal
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)

  // const [posts, setPosts] = useState([
  //   { imageUrl: "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823__340.jpg", username: "Asem", caption: "WOW" },
  //   { imageUrl: "https://www.bloginfohub.com/wp-content/uploads/2020/07/Why-React-JS-is-a-popular-choice-of-web-development-in-2020.png", username: "Ameed", caption: "WOW it is good" }
  //   , { imageUrl: "https://www.inovex.de/blog/wp-content/uploads/2022/01/one-year-of-react-native.png", username: "Hasan", caption: "WOW nice" }
  // ])

  //detecting every change in the auth using useEffect (like componentDidmount)
  useEffect(() => {//front-enf listener(like componentDidmount)
    const unsubsecribe = auth.onAuthStateChanged((authUser) => {//keeps you logged in(backend listener)
      if (authUser) {
        //user has logged in
        console.log(authUser)
        setUser(authUser)//setting the user to show that we have a user 
      } else {
        //user has logged out
        setUser(null)
      }
    })
    return () => {
      //cleanup actions (for performance)
      unsubsecribe()
    }
  }, [user, username])//anytime they change we call this useEffect

  //useEffect runs a peice of code based on a specific condition
  //you can write as many as you  like of useEffect
  useEffect(() => {
    //this is were the code is run
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {//every time a post changes it will fire this onSnapshot(this is like .get() but this better)
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,//getting the id to pass it to the post when we need it
        post: doc.data()
      })))//sending the hard-coded posts to the firestore
    })
  }, [])//if you put it empty it will run one but if you put [posts] it will runs every time posts is called

  const signUp = (e) => {
    e.preventDefault()

    //creating a user with email and password in firebase
    auth.createUserWithEmailAndPassword(email, password)//email and password are from the state
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))
    setOpen(false)//closing the modal after finishing
  }

  const signIn = (e) => {
    e.preventDefault()

    //checking the user with email and password in firebase
    auth.signInWithEmailAndPassword(email, password)//email and password are from the state
      .catch((error) => alert(error.message))
    setOpenSignin(false)//closing the modal after finishing
  }

  return (
    <div className="App">
      {/* sign-up modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
            </center>
            <Input
              type='text'
              placeholder='username'
              valuse={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type='text'
              placeholder='email'
              valuse={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type='password'
              placeholder='password'
              valuse={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signUp}> Sign Up</Button>
          </form>
        </div>
      </Modal> 

      {/* sign-in modal */}
      <Modal
        open={openSignin}
        onClose={() => setOpenSignin(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
            </center>
            <Input
              type='text'
              placeholder='email'
              valuse={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type='password'
              placeholder='password'
              valuse={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signIn}> Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className='app__header'>
        <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />

        {
          user ? (<Button onClick={() => auth.signOut()}>Log out</Button>)
            : (
              <div className="app__loginContainer">
                <Button onClick={() => setOpenSignin(true)}> Sign In</Button>
                <Button onClick={() => setOpen(true)}> Sign Up</Button>
              </div>)
        }
      </div>
      <div className="app__posts">
        {/* your posts */}
        <div className="app__postsleft">
          {posts.map(({ post, id }) => (
            <Post user={user} key={id} postId={id} imageUrl={post.imageUrl} username={post.username} caption={post.caption} />
          ))}
        </div>
        <div className="app__postsright">
          {/* instagram embed */}
          <InstagramEmbed
            url='https://instagr.am/p/Zw9o4/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
        </div>
      </div>


      {/* uploading files */}
      {user?.displayName ?//once there is a user check the user.desplayname
        (<ImageUpload username={user.displayName} />)
        : (
          <h3>you need to log in first</h3>
        )}
    </div>
  );
}

export default App;
