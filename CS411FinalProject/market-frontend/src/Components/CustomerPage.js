import './CustomerPage.scss';
import {useHistory} from "react-router-dom";
import React, { useState, useEffect } from 'react';
const BASE_ADDRESS = "http://20.88.14.242:10046";

function CustomerPage({mode, setMode, setIsLogin, setUserID}) {
    useEffect(() => {
        if (mode !== 1) {
            redirect(0);
        }
    }, []);

    let history = useHistory();
    const redirect = (idx) => {
        if (idx === 0) {
            history.push('/');
        }
        else if (idx === 1) {
            history.push('/customer/online-purchase');
        }
        else if (idx === 2) {
            history.push('/customer/purchase-history');
        }
        else if (idx === 3) {
            history.push('/customer/account-info');
        }
    }

    const clickLogOut = () => {
        setMode(0);
        setIsLogin(false);
        setUserID("");
        redirect(0);
    }

	return (
		<div className="cutomer_page">
            <div className="cutomer_page__top_nav">
                <div className="cutomer_page_redirect_button" onClick={() => {redirect(0);}}>{"< Home Page"}</div>
                <div className="cutomer_page_title">Customer Portal</div>
                <div className="cutomer_page_logout_button" onClick={clickLogOut}>{"Log Out >"}</div>
            </div>
            <div className="customer_page__intro">
                <h3>Welcome Customer!! This Is Your Portal!</h3>
            </div>
            <div className="cutomer_page_selection_section">
                <div className="cutomer_page_selection_card" onClick={() => {redirect(1);}}>Make Online Purchases</div>
                <div className="cutomer_page_selection_card" onClick={() => {redirect(2);}}>View Purchase History</div>
                <div className="cutomer_page_selection_card" onClick={() => {redirect(3);}}>View Account Info</div>
            </div>
		</div>
  	);
}

export default CustomerPage;