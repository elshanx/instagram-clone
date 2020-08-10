import React, { useState, useEffect } from 'react';
import '../styles/App.css';
import instagram from '../styles/images/instagram.png';
import Post from './Post';
import { db, auth } from '../firebase';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ImageUpload from './ImageUpload';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const App = () => {
  const classes = useStyles();
  const [openSignIn, setOpenSignIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        setPosts(
          snapshot.docs.map(doc => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signUp = event => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch(error => alert(error.message));
  };

  const SignIn = event => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.mesage));

    setOpenSignIn(false);
  };

  return (
    <div className='app'>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className='app___signup'>
            <center>
              <img className='app___logo' src={instagram} alt='Instagram' />
            </center>

            <Input
              placeholder='username'
              type='text'
              value={username}
              onChange={event => setUsername(event.target.value)}
            />

            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={event => setEmail(event.target.value)}
            />

            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={event => setPassword(event.target.value)}
            />

            <Button type='submit' onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
            <center>
              <img className='app__logo' src={instagram} alt='Instagram' />
            </center>

            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={event => setEmail(event.target.value)}
            />

            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={event => setPassword(event.target.value)}
            />

            <Button type='submit' onClick={SignIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      <div className='app__header'>
        <img className='app__logo' src={instagram} alt='Instagram' />

        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className='app__loginContainer'>
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className='app__post'>
        <div className='app__postLeft'>
          {posts.map(({ post, id }) => (
            <Post
              postId={id}
              key={id}
              username={post.username}
              user={user}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry, you need to login to upload</h3>
      )}
    </div>
  );
};

export default App;
