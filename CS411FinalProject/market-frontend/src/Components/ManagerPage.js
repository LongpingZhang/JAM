import './ManagerPage.scss';
import {useHistory} from "react-router-dom";
import React, { useState, useEffect } from 'react';

function ManagerPage({mode, setMode, setIsLogin, setUserID}) {
    useEffect(() => {
        if (mode !== 2) {
            redirect(0);
        }
    }, []);

    let history = useHistory();
    const redirect = (idx) => {
        if (idx === 0) {
            history.push('/');
        }
        else if (idx === 1) {
            history.push('/manager/check-inventories');
        }
        else if (idx === 2) {
            history.push('/manager/monitor-sales');
        }
        /*else if (idx === 3) {
            history.push('/manager/customer-stats');
        }*/
    }

    const clickLogOut = () => {
        setMode(0);
        setIsLogin(false);
        setUserID("");
        redirect(0);
    }

	return (
		<div className="manager_page">
            <div className="manager_page__top_nav">
                <div className="manager_page_redirect_button" onClick={() => {redirect(0);}}>{"< Home Page"}</div>
                <div className="manager_page_title">Manager Portal</div>
                <div className="manager_page_logout_button" onClick={clickLogOut}>{"Log Out >"}</div>
            </div>
            <div className="manager_page__intro">
                <h3>Welcome Manager!! This Is Your Portal!</h3>
            </div>
            <div className="manager_page_selection_section">
                <div className="manager_page_selection_card" onClick={() => {redirect(1);}}>Check Inventories</div>
                <div className="manager_page_selection_card" onClick={() => {redirect(2);}}>Monitor Sales</div>
                {/*<div className="manager_page_selection_card" onClick={() => {redirect(3);}}>View Customer Stats</div>*/}
            </div>
		</div>
  	);
}

export default ManagerPage;