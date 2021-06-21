import React from 'react'
import {Form, Button} from 'semantic-ui-react';

import gql from 'graphql-tag';
import {useMutation} from "@apollo/react-hooks";
import {useForm} from '../util/hooks';
import {FETCH_POSTS_QUERY} from '../util/graphql';


function PostForm() {
    const {onChange, onSubmit, values} = useForm(createPostCallback, {
        body: ''
    });

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
            //data.getPosts = [result.data.createPost, ...data.getPosts];
            proxy.writeQuery({query: FETCH_POSTS_QUERY, data: { getPosts: [result.data.createPost, ...data.getPosts]}});
            values.body = '';
        },
        onError(err) {
            console.log(err);
        }
    });

    function createPostCallback() {
        createPost();
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create Post: </h2>
                <Form.Field>
                    <Form.Input error={error ? true: false} placeholder="Something interesting" name="body" onChange={onChange} value={values.body} />
                    <Button type="submit" color="orange">Submit</Button>
                </Form.Field>
            </Form>
            {error && (
                <div className="ui error message" style={{marginBottom:20}}>
                    <ul className="list">
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )}
        </>
    );
}


const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!) {
        createPost(body: $body) {
            id body createdAt username
            likes {
                id username createdAt
            }
            likeCount
            comments {
                id body username createdAt
            }
            commentCount
        }
    }
`


export default PostForm;