import './LoginPage.scss';
import {useHistory} from "react-router-dom";
import React from 'react';
import axios from "axios";
const BASE_ADDRESS = "http://20.88.14.242:10046";

function LoginPage({mode, setMode, isLogin, setIsLogin, userID, setUserID}) {
	let history = useHistory();
    const redirect = (idx) => {
        if (idx === 0){
            history.push('/signup');
        }
        else if (idx === 1){
            setIsLogin(true);
            setMode(1);
            history.push('/customer');
        }
        else if (idx === 2){
            setIsLogin(true);
            setMode(2);
            history.push('/manager');
        }
        else {
            history.push('/');
        }
    }

    const handleSelectUsers = async (userID, password) => {
        try {
            const params = {
                "queryString": `SELECT * FROM Users WHERE userID = \"${userID}\" AND password = \"${password}\";`
            };
            console.log(params);
            const res = await axios.get(BASE_ADDRESS+'/login', {params: params});
            return res;
        } 
        catch (e) {
            alert("fail to find compatible user!");
            redirect();
        }
    };

    const clickLogin = async () => {
        let userID = document.getElementById("userId").value;
        let password = document.getElementById("password").value;
        let res = await handleSelectUsers(userID, password);
        res = res.data.data;
        if (res) {
            if (res.userType === 'C') {
                console.log("JAJAJAJAJA", userID, 'C')
                setUserID(res.userID);
                redirect(1);
            }
            else if (res.userType === 'M') {
                setUserID(res.userID);
                console.log("JAJAJAJAJA", userID, 'M')
                redirect(2);
            }
        }
        else {
            alert("Invalid User ID or Password");
            redirect(0);
        }
    }
    
    const clickSignUp = () => {
        redirect(0);
    }

	return (
		<div className="login_page">
            <div className="login_page_redirect_button" onClick={() => {redirect();}}>{"< Home Page"}</div>
            <p>Login Here</p>
            <form>
                <label for="userId" className="login_page_input">Enter User ID:</label>
                <input type="text" className="login_page_input" id="userId" name="userId"/>
                <label for="password" className="login_page_input">Enter Password:</label>
                <input type="text" className="login_page_input" id="password" name="password"/>
            </form>
            <div className="login_button" onClick={clickLogin}>Login</div>
            <div>Have no account yet? Click here to sign up!</div>
            <div className="signup_button" onClick={clickSignUp}>Sign Up</div>
		</div>
  	);
}

export default LoginPage;