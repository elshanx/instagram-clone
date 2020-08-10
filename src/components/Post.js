import React, { useState, useEffect } from 'react';
import '../styles/Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from '../firebase';
import firebase from 'firebase';

function Post({ postId, user, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  // const [timePosted, setTimePosted] = useState('');

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .orderBy('timestamp', 'asc')
        .onSnapshot(snapshot => {
          setComments(snapshot.docs.map(doc => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = e => {
    e.preventDefault();
    db.collection('posts').doc(postId).collection('comments').add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment('');
  };

  return (
    <div className='post'>
      <div className='post__header'>
        <Avatar className='post__avatar' alt={username} />
        <h3 className='post__username'>{username} </h3>
      </div>

      <img className='post__image' alt='logo' src={imageUrl} />
      <div className='post__description'>
        <span className='post__username'>{username} </span>
        {caption}{' '}
      </div>

      <div className='post__comments'>
        {comments.map(comment => (
          <div>
            <span className='post__comments--username'>{comment.username}</span>{' '}
            <span className='post__comments--text'>{comment.text}</span>
          </div>
        ))}
      </div>

      {user && (
        <form className='post__commentBox'>
          <input
            className='post__input'
            type='text'
            placeholder='Add a Comment....'
            value={comment}
            onChange={e => setComment(e.target.value)}
          />

          <button
            className='post__button'
            disabled={!comment}
            type='submit'
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
