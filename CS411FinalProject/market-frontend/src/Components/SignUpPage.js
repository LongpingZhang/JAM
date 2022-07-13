import './SignUpPage.scss';
import {useHistory} from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from "axios";
const BASE_ADDRESS = "http://20.88.14.242:10046";

function SignUpPage({mode, setMode, setIsLogin, setUserID}) {
    let userID = "";
    let password = "";
    let firstName = "";
    let lastName = "";
    let address = "";
    let userType = "";
    
    let history = useHistory();
    const redirect = (idx) => {
        if (idx === 0){
            history.push('/login');
        }
        else {
            history.push('/');
        }
    }

    const handleInsertUsers = async () => {
        try {
            const obj = {
                "userID": userID, 
                "password": password, 
                "userType": userType,
                "firstName": firstName, 
                "lastName": lastName, 
                "address": address
            };
            await axios.post(BASE_ADDRESS+'/signup', obj);
        } 
        catch (e) {
            alert("fail to create new user", e);
            redirect(0);
        }
    };

    const clickSignUp = () => {
        userID = document.getElementById("userId").value;
        password = document.getElementById("password").value;
        firstName = document.getElementById("fname").value;
        lastName = document.getElementById("lname").value;
        address = document.getElementById("address").value;
        userType = document.getElementById("type").value;
        if (userID && password && (userType === 'C' || userType === 'M')) {
            handleInsertUsers();
            redirect(0);
        }
        else {
            alert("UserID and Password are required!");
        }
    }

	return (
		<div className="sign_up_page">
            <div className="sign_up_page_redirect_button" onClick={() => {redirect();}}>{"< Home Page"}</div>
            <p>Sign Up Here</p>
            <form>
                <div className="sign_up_page_input">
                    <label for="userId">*User ID:</label>
                    <input type="text" id="userId" name="userId"/>
                </div>
                <div className="sign_up_page_input">
                    <label for="password">*Create new password:</label>
                    <input type="text" id="password" name="password"/>
                </div>
                <div className="sign_up_page_input">
                    <label for="type">*User Type (C: Customer, M: Manager):</label>
                    <input type="text" id="type" name="type"/>
                </div>
                <div className="sign_up_page_input">
                    <label for="fname">First Name:</label>
                    <input type="text" id="fname" name="fname"/>
                </div>
                <div className="sign_up_page_input">
                    <label for="lname">Last Name:</label>
                    <input type="text" id="lname" name="lname"/>
                </div>
                <div className="sign_up_page_input">
                    <label for="address">Address:</label>
                    <input type="text" id="address" name="address"/>
                </div>
            </form>
            <div className="sign_up_button" onClick={() => {clickSignUp();}}>Sign Up</div>
		</div>
  	);
}

export default SignUpPage;