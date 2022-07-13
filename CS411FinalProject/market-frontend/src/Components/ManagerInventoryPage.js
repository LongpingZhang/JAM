import './ManagerInventoryPage.scss';
import {useHistory} from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from "axios";
const BASE_ADDRESS = "http://20.88.14.242:10046";

function ManagerInventoryPage({mode, setMode, setIsLogin, setUserID}) {
    const [productID, setproductID] = useState('');
    const [storeName, setstoreName] = useState('');
    const [item, setitem] = useState('');
    const [price, setprice] = useState('');
    const [inventory, setinventory] = useState('');
    const [productID_update, setproductID_update] = useState('');
    const [storeName_update, setstoreName_update] = useState('');
    const [price_update, setprice_update] = useState('');
    const [inventory_update, setinventory_update] = useState('');
    const [storeName_search, setstoreName_search] = useState('');
    const [products_search, setproducts_search] = useState([]);

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

    const insertAProduct = async () => {
        try{
            const requestBody = {
                "queryType": "checkInventories",
                "productID": productID,
                "storeName": storeName,
                "item": item,
                "price": price,
                "inventory": inventory
            };
            await axios.post(BASE_ADDRESS+'/manager/check-inventories', requestBody);
            alert("insertAProduct Successful")
        } catch (e) {
            alert("fail to insert a product")
        }
    }

    const updateAProduct = async () => {
        try{
            const requestBody = {
                "queryType": "updateAProduct",
                "productID": productID_update,
                "storeName": storeName_update,
                "inventory": inventory_update
            };
            await axios.post(BASE_ADDRESS+'/manager/check-inventories', requestBody);
            alert("updateAProduct Successful")
        } catch (e) {
            alert("fail to insert a product")
        }
    }

    // Check inventories by store names
    const checkInventories = async () => {
        try {
            const params = {
                // "queryString": "SELECT * FROM Products",
                "queryType": "checkInventories",
                "storeName": storeName_search
            }
            const res = await axios.get(BASE_ADDRESS+'/manager/check-inventories', {params: params});
            console.log("getAllProducts", res.data.data)
            setproducts_search(res.data.data);
        } 
        catch (e) {
            alert("fail to get all products!");
        }
    };

	return (
		<div className="manager_inventory_page">
            <div className="manager_inventory_page__top_nav">
                <div className="manager_inventory_page_redirect_button">
                    <div className="btn" onClick={() => {redirect(0);}}>{"<< Home Page"}</div>
                    <div className="btn" onClick={() => {redirect(1);}}>{"< Manager Home Page"}</div>
                </div>
                <div className="manager_inventory_page_title">Manager Inventory Page</div>
                <div className="manager_inventory_page_logout_button" onClick={clickLogOut}>{"Log Out >"}</div>
            </div>
            <div className="create_and_update">
                <div className="add_item">
                    <h4 className="title"> Add a Item </h4>
                    <label> ProductID: </label>
                    <input type="text" name="productID" onChange={(e) => {
                        setproductID(e.target.value)
                    } }/>
                    <br></br>
                    <label> StoreName: </label>
                    <input type="text" name="storeName" onChange={(e) => {
                        setstoreName(e.target.value)
                    } }/>
                    <br></br>
                    <label> Item: </label>
                    <input type="text" name="item" onChange={(e) => {
                        setitem(e.target.value)
                    } }/>
                    <br></br>
                    <label> Price: </label>
                    <input type="text" name="price" onChange={(e) => {
                        setprice(e.target.value)
                    } }/>
                    <br></br>
                    <label> Inventory: </label>
                    <input type="text" name="inventory" onChange={(e) => {
                        setinventory(e.target.value)
                    } }/>
                    <br></br>
                    <button onClick={() => {insertAProduct();}}> Submit </button>

                </div>
                <div className="update_item">
                    <h4 className="title"> Update a Item </h4>
                    <label> ProductID: </label>
                    <input type="text" name="productID" onChange={(e) => {
                        setproductID_update(e.target.value)
                    } }/>
                    <br></br>
                    <label> StoreName: </label>
                    <input type="text" name="storeName" onChange={(e) => {
                        setstoreName_update(e.target.value)
                    } }/>
                    <br></br>
                    <label> Inventory: </label>
                    <input type="text" name="inventory" onChange={(e) => {
                        setinventory_update(e.target.value)
                    } }/>
                    <br></br>
                    <button onClick={() => {updateAProduct();}}> Submit </button>

                </div>
            </div>
            
            <div className="show_products">
                <div className="buttons">
                    <div className="show_all_products">
                        <label> Check Inventories of the Store </label>
                        <input type="text" name="storeName" placeholder="Enter the store name" onChange={(e) => {
                            setstoreName_search(e.target.value)
                        } }/>
                        <button onClick={() => {checkInventories();}}> Check </button>
                    </div>
                </div>
                <div className="table">
                    <table id="show_all_products">
                        <tr>
                            <th>StoreName</th>
                            <th>ProductID</th>
                            <th>Item</th>
                            <th>Inventory</th>
                        </tr>
                        {(products_search.length) ?
                            (products_search.map((e, idx) => {
                                return (<tr id={idx}>
                                            <td className="cutomer_purchase_history_page__table_content">{e[0]}</td>
                                            <td className="cutomer_purchase_history_page__table_content">{e[1]}</td>
                                            <td className="cutomer_purchase_history_page__table_content">{e[2]}</td>
                                            <td className="cutomer_purchase_history_page__table_content">{e[3]}</td>
                                        </tr>);
                            }))
                            :
                            null
                        }
                    </table>
                </div>
            </div>
            
        </div>
  	);
}

export default ManagerInventoryPage;