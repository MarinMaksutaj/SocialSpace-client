import {useQuery} from "@apollo/react-hooks";


import {Grid, Transition}  from 'semantic-ui-react';
import React, {useContext} from 'react';
import PostCard from '../components/PostCard';
import {AuthContext} from '../context/auth';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from "../util/graphql";




function Home() {
    const {user} = useContext(AuthContext);
    const {loading, data: {getPosts: posts} = {}} = useQuery(FETCH_POSTS_QUERY);

    return (
        <Grid columns={2}>
    <Grid.Row className="title-text">
        <h1>SocialSpace Posts</h1>
    </Grid.Row>
    <Grid.Row>
        {user && (
            <Grid.Column>
                <PostForm/>
            </Grid.Column>
        ) }
      {loading ? (
          <h1>Loading posts....</h1>
      ): ( <Transition.Group>
         {posts && posts.map((post) => {
             return (<Grid.Column key={post.id} style={{margin: 0, marginBottom: 20}}>
                 <PostCard post={post}/>
             </Grid.Column>);
         })}
         </Transition.Group>
      )}
    </Grid.Row>
    </Grid>
    )
}



export default Home;