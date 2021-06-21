import React from "react";
import {useReducer, createContext} from 'react';
import jwtDecode from "jwt-decode";

const initialState = {
    user: null
};


if (localStorage.getItem("userToken")) {
    const token = jwtDecode(localStorage.getItem("userToken"));
    if (token.exp * 1000 < Date.now()) {
        localStorage.removeItem("userToken"); 
    } else {
        initialState.user = token;
    }
}

const AuthContext = createContext({
    user: null,
    login: (data) => {},
    logout: () => {}
})

function authReducer(state, action) {
    switch(action.type) {
        case "LOGIN":
            return {
                ...state,
                user: action.payload
            }
        case "LOGOUT":
            return {
                ...state,
                user: null
            }
        default:
            return state;
    }
}



function AuthProvider(props) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    function login(userData) {
        localStorage.setItem("userToken" , userData.token);
        dispatch({
            type: "LOGIN",
            payload: userData
        });
    }
    function logout() {
        localStorage.removeItem("userToken");
        dispatch({
            type: "LOGOUT"
        });
    }
    return (
        <AuthContext.Provider 
            value={{user: state.user, login, logout}}
            {...props}
        />
    )
}


export {AuthContext, AuthProvider}





