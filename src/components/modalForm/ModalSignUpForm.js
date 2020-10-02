import React, { useState, useEffect } from 'react';
import './App.css';
import { auth } from './firebase'

import { Button, makeStyles, Input } from '@material-ui/core';
import Modal from '@material-ui/core/Modal'

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

const  signUp = (e) => {
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

const  signIn = (e) => {
    e.preventDefault()

    //checking the user with email and password in firebase
    auth.signInWithEmailAndPassword(email, password)//email and password are from the state
        .catch((error) => alert(error.message))
    setOpenSignin(false)//closing the modal after finishing
}
function ModalSignUpForm() {
    //material UI
    const classes = useStyles()
    const [modalStyle] = useState(getModalStyle);

    const [open, setOpen] = useState(false)//opens the sing-up modal
    const [openSignin, setOpenSignin] = useState(false)//opens the sing-in modal
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [user, setUser] = useState(null)

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

    return (
        <div>
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
        </div>
    )
}

export default ModalSignUpForm
