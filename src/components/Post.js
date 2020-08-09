import React from 'react';
import '../styles/Post.css';
import { Avatar } from '@material-ui/core';

const Post = ({ username, caption, imageURL }) => {
  return (
    <div className='post'>
      <div className='post__header'>
        <Avatar
          className='post__avatar'
          alt={username}
          src='https://c8.alamy.com/comp/KE99PM/man-round-avatar-icon-vector-illustration-sign-on-isolated-background-KE99PM.jpg'
        />
        <h3>{username}</h3>
      </div>
      <img className='post__img' src={imageURL} alt='user' />
      <h4 className='post__text'>
        <strong>{username}:</strong> {caption}
      </h4>
    </div>
  );
};

export default Post;
