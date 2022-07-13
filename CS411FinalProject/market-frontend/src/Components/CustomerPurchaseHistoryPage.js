import './CustomerPurchaseHistoryPage.scss';
import {useHistory} from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from "axios";
const BASE_ADDRESS = "http://20.88.14.242:10046";

function CustomerPurchaseHistoryPage({mode, setMode, userID, setIsLogin, setUserID}) {
	const [purchaseHistory, setPurchaseHistory] = useState([]);

	useEffect(() => {
        if (userID === "") {
            redirect(0);
        }
        else {
            getAllPurchaseHistory();
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

    const getAllPurchaseHistory = async () => {
        try {
            const params = {
                userID: userID
            };
            const res = await axios.get(BASE_ADDRESS+'/customer/purchase-history', {params: params});
            console.log("getAllPurchaseHistory", res.data.data)
            if (res.data.data.length){
                setPurchaseHistory(res.data.data);
                console.log("purchaseHistory",purchaseHistory)
            }
            
        } 
        catch (e) {
            alert("fail to get purchase history!");
            redirect(1);
        }
    };

	return (
		<div className="cutomer_purchase_history_page">
            <div className="cutomer_purchase_history_page__top_nav">
                <div className="cutomer_purchase_history_page_redirect_button">
                    <div className="btn" onClick={() => {redirect(0);}}>{"<< Home Page"}</div>
                    <div className="btn" onClick={() => {redirect(1);}}>{"< Customer Home Page"}</div>
                </div>
                <div className="cutomer_purchase_history_page_title">Purchase History</div>
                <div className="cutomer_purchase_history_page_logout_button" onClick={clickLogOut}>{"Log Out >"}</div>
            </div>
            <table className="cutomer_purchase_history_page__table">
                <tr>
                    <th className="cutomer_purchase_history_page__table_header">Product Name</th>
                    <th className="cutomer_purchase_history_page__table_header">Price</th>
                    <th className="cutomer_purchase_history_page__table_header">Store Name</th>
                    <th className="cutomer_purchase_history_page__table_header">Date</th>
                </tr>
                {(purchaseHistory.length) ?
                    (purchaseHistory.map((e, idx) => {
                        return (<tr id={idx}>
                                    <td className="cutomer_purchase_history_page__table_content">{e[8]}</td>
                                    <td className="cutomer_purchase_history_page__table_content">{e[9]}</td>
                                    <td className="cutomer_purchase_history_page__table_content">{e[7]}</td>
                                    <td className="cutomer_purchase_history_page__table_content">{e[2]}</td>
                                </tr>);
                    }))
                    :
                    (
                        <tr>
                            <td className="cutomer_purchase_history_page__table_content">N/A</td>
                            <td className="cutomer_purchase_history_page__table_content">N/A</td>
                            <td className="cutomer_purchase_history_page__table_content">N/A</td>
                            <td className="cutomer_purchase_history_page__table_content">N/A</td>
                        </tr>
                    )
                }
                
            </table>
        </div>
  	);
}

export default CustomerPurchaseHistoryPage;