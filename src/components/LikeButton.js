import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {useMutation} from '@apollo/react-hooks';
import {Button, Label, Icon} from 'semantic-ui-react';

import gql from 'graphql-tag';


//fix the highlight

function LikeButton ({user, post: {id, likes, likeCount}}) {
    const [liked, setLiked] = useState(false);
    useEffect(() => {
        if (user && likes.find(like => like.username === user.username)) {
            setLiked(true);
        } else {
            
            setLiked(false);
        }
    }, [user, likes]);

    
    const [likePost, {error}] = useMutation(LIKE_POST_MUTATION, {
        variables: {postId: id},
        error(err) {
            console.log(err);
        }
    });

    const likeButton = user ? (
        liked ? (
            <Button color='orange'>
        <Icon name='arrow up' />
        Like
      </Button>
        ) : (
            <Button color='orange' basic>
        <Icon name='arrow up' />
        Like
      </Button>
        )
    ) : (
        <Button as={Link} to="/login" color='orange' basic>
        <Icon name='arrow up' />
        Like
      </Button>
    )

    return (

        <Button as='div' labelPosition='right' onClick={user ? likePost : ()=>console.log("not logged in")}>
            {likeButton}
      <Label as='a' basic color='orange' pointing='left'>
        {likeCount}
      </Label>
    </Button>
    );
}


const LIKE_POST_MUTATION = gql `
    mutation likePost($postId: ID!) {
        likePost(postId: $postId) {
            id
            likes {
                id username
            }
            likeCount
        }
    }
`

export default LikeButton;