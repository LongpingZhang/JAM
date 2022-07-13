import './ManagerStatsPage.scss';
import {useHistory} from "react-router-dom";
import React, { useState, useEffect } from 'react';
const BASE_ADDRESS = "http://20.88.14.242:10046";

function ManagerStatsPage({mode, setMode, setIsLogin, setUserID}) {
    useEffect(() => {
        if (mode !== 2) {
            redirect(0);
        }
    }, []);

    let history = useHistory();
    const redirect = (idx) => {
        if (idx === 0){
            history.push('/');
        }
        else if (idx === 1){
            history.push('/manager');
        }
    }

    const clickLogOut = () => {
        setMode(0);
        setIsLogin(false);
        setUserID("");
        redirect(0);
    }

	return (
		<div className="manager_stats_page">
            <div className="manager_stats_page__top_nav">
                <div className="manager_stats_page_redirect_button">
                    <div className="btn" onClick={() => {redirect(0);}}>{"<< Home Page"}</div>
                    <div className="btn" onClick={() => {redirect(1);}}>{"< Manager Home Page"}</div>
                </div>
                <div className="manager_stats_page_title">Manager Stats Page</div>
                <div className="manager_stats_page_logout_button" onClick={clickLogOut}>{"Log Out >"}</div>
            </div>
            <p>Manager Stats Page</p>
        </div>
  	);
}

export default ManagerStatsPage;