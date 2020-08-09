import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { storage, db } from '../firebase';
import firebase from 'firebase';
import '../styles/ImageUpload.css';

const ImageUpload = ({ username }) => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState('');

  const handleChange = e => {
    if (e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleUpload = e => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      function onErr(err) {
        console.log(err);
        alert(err);
      },
      function completeFn() {
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            db.collection('posts').add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
          });

        setProgress(0);
        setCaption('');
        setImage(null);
      }
    );
  };

  return (
    <div classname='imageUpload'>
      <progress className='imageupload_progress' value={progress} max='100' />
      <input
        onChange={e => setCaption(e.target.value)}
        value={caption}
        type='text'
        name=''
        id=''
        placeholder='Enter a caption...'
      />
      <input onChange={handleChange} type='file' name='' id='' />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default ImageUpload;
