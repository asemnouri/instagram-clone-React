import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import { storage, db } from '../../firebase'
import firebase from 'firebase'
import './imageUpload.css'

function ImageUpload({ username }) {
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)//for progress bar 

    const handleCaptionChange = (e) => {
        setCaption(e.target.value)
    }

    const handleChange = (e) => {
        if (e.target.files[0]) {//choosing the first file
            setImage(e.target.files[0])
        }
    }

    const handleUpload = () => {
        //uploading the image
        const uploadTask = storage.ref(`images/${image.name}`).put(image)//grapping the image from the pc and then putting it in the storage

        //this function is only for the progress no other functionality
        uploadTask.on(//adding a listener to track the upload speed 
            "state_changed",
            (snapshot) => {
                //progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progress)
            },//error function 
            (error) => {
                console.log(error.message)
            },//complete function (when the upload is done)
            () => {
                //getting the image from uploadTask so we can use it in the front-end
                storage
                    .ref('images')//the name that we gave above in the uploadTask
                    .child(image.name)//name of the image file
                    .getDownloadURL()
                    .then((url) => {//posting the image inside the db so we can get it
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),//putting the post on top based on date
                            caption: caption,
                            imageUrl: url,//the url we got from the storage
                            username: username
                        })
                        //setting every thing to original value
                        setProgress(0)
                        setImage(null)
                        setCaption('')
                    })
            }

        )
    }

    return (
        <div className="imageupload">
            {/* creating the upload image form */}
            {/* caption input(write your caption) */}
            {/* image upload */}
            {/* Psot button */}
            <progress className="imageupload__progress" value={progress} max="100"/>
            <input type="text" placeholder='Enter a caption' value={caption} onChange={handleCaptionChange} />
            <input type="file" onChange={handleChange} />
            {//making the upload work only when there is a file
                image && (<Button onClick={handleUpload}>
                    Upload
                </Button>)
            }
            
        </div>
    )
}

export default ImageUpload
