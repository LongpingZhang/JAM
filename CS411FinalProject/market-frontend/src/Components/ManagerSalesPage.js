import './ManagerSalesPage.scss';
import {useHistory} from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from "axios";
const BASE_ADDRESS = "http://20.88.14.242:10046";

function ManagerSalesPage({mode, setMode, setIsLogin, setUserID}) {
    const [sales, setSales] = useState([]);
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

    const handleSelectSales = async (storeName) => {
        try {
            const params = {
                "storeName": storeName
            };
            const res = await axios.get(BASE_ADDRESS+'/manager/monitor-sales', {params: params});
            return res
        } 
        catch (e) {
            alert("fail to get all product list!");
            redirect(1);
        }
    };

    const clickSubmit = async () => {
        let storeName = document.getElementById("storeName").value;
        let res = await handleSelectSales(storeName);
        res = res.data.data;
        setSales(res);
        console.log("sales", sales, res);
    }

	return (
		<div className="manager_sales_page">
            <div className="manager_sales_page__top_nav">
                <div className="manager_sales_page_redirect_button">
                    <div className="btn" onClick={() => {redirect(0);}}>{"<< Home Page"}</div>
                    <div className="btn" onClick={() => {redirect(1);}}>{"< Manager Home Page"}</div>
                </div>
                <div className="manager_sales_page_title">Manager Sales Page</div>
                <div className="manager_sales_page_logout_button" onClick={clickLogOut}>{"Log Out >"}</div>
            </div>
            <form className="manager_sales_page_form">
                <label for="storeName" className="manager_sales_page_input">Store Name:</label>
                <input type="text" className="manager_sales_page_input" id="storeName" name="storeName"/>
            </form>
            <div className="manager_sales_page_submit_button" onClick={clickSubmit}>Submit!</div>
            {
                (sales.length) ? 
                    <table className="manager_sales_page__table">
                        <tr>
                            <th className="manager_sales_page__table_header">Store Name</th>
                            <th className="manager_sales_page__table_header">Sales</th>
                        </tr>
                        {sales.map((e, idx) => {
                            return (
                                <tr>
                                    <th className="manager_sales_page__table_content">{e[0]}</th>
                                    <th className="manager_sales_page__table_content">{e[1]}</th>
                                </tr>);
                            })
                        }
                    </table>
                    :
                    null
            }
        </div>
  	);
}

export default ManagerSalesPage;