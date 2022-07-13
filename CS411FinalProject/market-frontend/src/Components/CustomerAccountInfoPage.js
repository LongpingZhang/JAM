import './CustomerAccountInfoPage.scss';
import {useHistory} from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from "axios";
const BASE_ADDRESS = "http://20.88.14.242:10046";

function CustomerAccountInfoPage({mode, setMode, userID, setIsLogin, setUserID}) {
	const [accInfo, setAccInfo] = useState([]);

	useEffect(() => {
        if (userID === "") {
            redirect(0);
        }
        else {
            getAccountInfo();
        }
    }, []);

    let history = useHistory();
    const redirect = (idx) => {
        if (idx === 0){
            history.push('/');
        }
        else if (idx === 1){
            history.push('/customer');
        }
    }

    const clickLogOut = () => {
        setMode(0);
        setIsLogin(false);
        setUserID("");
        redirect(0);
    }

    const getAccountInfo = async () => {
        try {
            const params = {
                userID: userID
            };
            const res = await axios.get(BASE_ADDRESS+'/customer/account-info', {params: params});
            console.log("HIHIHIHIHIHIHIHIHI", res, params)
            setAccInfo(res.data.data[0]);
        } 
        catch (e) {
            alert("fail to get Account Info!");
            redirect(1);
        }
    };

	return (
        <div className="cutomer_account_info_page">
            <div className="cutomer_account_info_page__top_nav">
                <div className="cutomer_account_info_page_redirect_button">
                    <div className="btn" onClick={() => {redirect(0);}}>{"<< Home Page"}</div>
                    <div className="btn" onClick={() => {redirect(1);}}>{"< Customer Home Page"}</div>
                </div>
                <div className="cutomer_account_info_page_title">Account Info</div>
                <div className="cutomer_account_info_page_logout_button" onClick={clickLogOut}>{"Log Out >"}</div>
            </div>
            <p>{`Name: ${accInfo[3]} ${accInfo[4]}`}</p>
            <p>{`CustomerID: ${accInfo[0]}`}</p>
            <p>{`Address: ${accInfo[5]}`}</p>
        </div>
  	);
}

export default CustomerAccountInfoPage;