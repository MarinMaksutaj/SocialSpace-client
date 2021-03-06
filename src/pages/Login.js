import React, {useContext, useState} from 'react'
import {Form, Button} from "semantic-ui-react";
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
//import { getArgumentValues } from 'graphql/execution/values';
import { AuthContext } from '../context/auth';
import {useForm} from '../util/hooks';
function Login(props) {
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});

    const initialState = {
        username: '',
        password: '',
    };
    const {onChange, onSubmit, values} = useForm(logUser, initialState);
    const [loginUser, {loading}] = useMutation(LOGIN_USER, {
        update(proxy, result) {
            context.login(result.data.login);
            props.history.push('/');
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    });

    function logUser() {
        loginUser();
    }
    
    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
                <h1>Login</h1>
                <Form.Input error={errors.username ? true : false} type="text" label="Username" placeholder="Username" name="username" value={values.username} 
                onChange={onChange}></Form.Input>
                <Form.Input  error={errors.password ? true : false} type="password" label="Password" placeholder="Password" name="password" value={values.password} 
                onChange={onChange}></Form.Input>
                <Button type="submit" primary>Login</Button>
            </Form>
            {Object.keys(errors).length > 0 && (
            <div className="ui error message">
                <ul className="list">
                    {Object.values(errors).map(value => (
                        <li key={value}>{value}</li>
                    ))}
                </ul>
            </div>)}
        </div>
    )
}


const LOGIN_USER = gql`

    mutation login (
        $username: String!
        $password: String!
    ) {
        login(username: $username password: $password) {
            id email username createdAt token
        }
    }
`

export default Login;