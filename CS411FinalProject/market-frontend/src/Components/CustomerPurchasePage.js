import './CustomerPurchasePage.scss';
import {useHistory} from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from "axios";

let pid = 2000;
const BASE_ADDRESS = "http://20.88.14.242:10046";

function CustomerPurchasePage({mode, setMode, userID, setIsLogin, setUserID}) {
    const [products, setProducts] = useState([]); //[{productID, storeName, item, price, quantity}]
	const [selectedItem, setSelectedItem] = useState([]);
    const [curPurchaseID, setCurPurchaseID] = useState(1000);
    
	useEffect(() => {
        if (mode !== 1) {
            redirect(0);
        }
        getAllItems();
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

    const getAllItems = async () => {
        try {
            const params = {
                "queryString": "SELECT * FROM Products;",
            };
            const res = await axios.get(BASE_ADDRESS+'/customer/online-purchase', {params: params});
            setProducts(res.data.data);
        } 
        catch (e) {
            alert("fail to get all product list!");
            redirect(1);
        }
    };

    const getNextPurchaseID = async () => {
        try {
            const params = {
                queryString: "SELECT purchaseID FROM Purchases ORDER BY purchaseID DESC;",
            };
            const res = await axios.get(BASE_ADDRESS+'/customer/online-purchase', {params: params});
            
            setCurPurchaseID(Number(res.data.data[0])+1);
            console.log("PurchaseIDDDD:", Number(res.data.data[0])+1, curPurchaseID)
        } 
        catch (e) {
            alert("fail to get newest PurchaseID!");
        }
    };

    const handleInsertCarts = async (productID, storeName, item, price) => {
        try {
            const requestBody = {
                "queryType": "handleInsertCarts",
                "data": {
                    "customerID": userID,
                    "productID": productID,
                    "storeName": storeName,
                    "item": item,
                    "price": price,
                    "quantity": 1
                }
            };
            console.log("handleInsertCarts", requestBody);
            await axios.post(BASE_ADDRESS+'/customer/online-purchase', requestBody);
        } 
        catch (e) {
            alert("fail to insert new item to cart");
        }
    };

    const handleInsertPurchases = async () => {
        try {
            const requestBody = {
                "queryType": "handleInsertPurchases",
                "data": {
                    "purchaseID": pid,//curPurchaseID,
                    "customerID": userID,
                    "date": Date().toLocaleString()
                }
            };
            console.log("Testing handleInsertPurchases Here: ", requestBody)
            await axios.post(BASE_ADDRESS+'/customer/online-purchase', requestBody);
        } 
        catch (e) {
            alert("fail to insert new entry to Purchases");
        }
    };

    const handleInsertIncludes = async (productID, storeName) => {
        try {
            const requestBody = {
                "queryType": "handleInsertIncludes",
                "data": {
                    "purchaseID": pid,//curPurchaseID, 
                    "productID": productID, 
                    "storeName": storeName, 
                    "quantity": 1
                }
            };
            console.log("Testing handleInsertIncludes Here: ", requestBody)
            await axios.post(BASE_ADDRESS+'/customer/online-purchase', requestBody);
        } 
        catch (e) {
            alert("fail to insert new item to includes");
        }
    };

    const handleUpdateProducts = async (productID, storeName) => {
        try {
            console.log("FHFHFHFHGFHFHFHFHF",productID, storeName);
            const requestBody = {
                "queryType": "handleUpdateProducts",
                "productID": productID, 
                "storeName": storeName
            };
            console.log("Testing handleUpdateProducts Here: ", requestBody)
            await axios.post(BASE_ADDRESS+'/customer/online-purchase', requestBody);
        } 
        catch (e) {
            alert("fail to update inventory in Products");
        }
    };

    const handleDeleteCarts = async () => {
        try {
            const requestBody = {
                "queryType": "handleDeleteCarts",
                "data": {
                    "userID": userID
                }
            };
            console.log("Testing handleDeleteCarts Here: ", requestBody)
            await axios.post(BASE_ADDRESS+'/customer/online-purchase', requestBody);
        } 
        catch (e) {
            alert("fail to insert new item to cart");
        }
    };

    const selectItem = (productID, storeName, item, price) => {
        let newSelectedItem = [...selectedItem, {productID: productID, storeName: storeName, item: item, price: price}];
        console.log(newSelectedItem);
        setSelectedItem(newSelectedItem);
        handleInsertCarts(productID, storeName, item, price);
    }

    const clickCheckout = async () => {
        setCurPurchaseID(curPurchaseID+1);
        pid += 1;
        console.log("curPurchaseID", pid, selectedItem);
        await handleInsertPurchases();
        console.log("check====", selectedItem);
        selectedItem.map(async (e) => {
                await handleUpdateProducts(e.productID, e.storeName);
                await handleInsertIncludes(e.productID, e.storeName);
            }
        )
        setSelectedItem([]);
        await handleDeleteCarts();
        //await getNextPurchaseID();
    }

    /*=================*/
    const [debug, setDebug] = useState([]);
    const handleDebugging = async (queryString) => {
        try {
            const params = {
                "queryType": "debug",
                "queryString": queryString,
                /*
                "data": {
                    "purchaseID": curPurchaseID, 
                    "productID": productID, 
                    "storeName": storeName, 
                    "quantity": 1
                }*/
            };
            const res = await axios.get('http://localhost:3000/customer/online-purchase', {params: params});
            setDebug(res)
        } 
        catch (e) {
            alert("fail to insert new item to includes");
        }
    };

    const debugging = () => {
        let debugQuery = document.getElementById("debug").value;
        handleDebugging(debugQuery);
        console.log("=========DEBUGGING=========", debug);
    }
    /*=================*/

	return (
		<div className="cutomer_purchase_page">
            <div className="cutomer_purchase_page__top_nav">
                <div className="cutomer_page_redirect_button">
                    <div className="btn" onClick={() => {redirect(0);}}>{"<< Home Page"}</div>
                    <div className="btn" onClick={() => {redirect(1);}}>{"< Customer Home Page"}</div>
                </div>
                <div className="cutomer_purchase_page_title">Online Purchase</div>
                <div className="cutomer_purchase_page_logout_button" onClick={clickLogOut}>{"Log Out >"}</div>
            </div>
            <div className="item_selection_section">
                <div className="grid_container">
                    {products.map((e, idx) => {
                            return (<div className="grid_item" id={idx} onClick={() => {selectItem(e[0], e[1], e[2], e[3]);}}>
                                        <h3>{`${e[2]}`}</h3>
                                        <div className="grid_item__content">
                                            <div>{`Product ID: ${e[0]}`}</div>
                                            <div>{`Price: ${e[3]}`}</div>
                                            <div>{`Numbers Left: ${e[4]}`}</div>
                                            <div>{`Store: ${e[1]}`}</div>
                                        </div>
                                    </div>);
                        })
                    }
                </div>
            </div>
            <div className="selected_items_list">
                {(selectedItem.length) ?
                    <p>Shopping Cart:</p>
                    :
                    null
                }
                {(selectedItem.length) ?
                    <table>
                        <tr>
                            <th className="cutomer_purchase_page__table_header">Product Name</th>
                            <th className="cutomer_purchase_page__table_header">ProductID</th>
                            <th className="cutomer_purchase_page__table_header">Price</th>
                            <th className="cutomer_purchase_page__table_header">Store</th>
                        </tr>
                        {selectedItem.map((e, idx) => {
                            return (
                                <tr>
                                    <th className="cutomer_purchase_page__table_content">{e.item}</th>
                                    <th className="cutomer_purchase_page__table_content">{e.productID}</th>
                                    <th className="cutomer_purchase_page__table_content">{e.price}</th>
                                    <th className="cutomer_purchase_page__table_content">{e.storeName}</th>
                                </tr>);
                            })
                        }
                    </table>
                    :
                    null
                }
            </div>
            {(selectedItem.length) ?
                <div className="checkout_button" onClick={() => {clickCheckout();}}>Checkout!</div>
                :
                null
            }
            {/*
            <form>
                <label for="debug">Debuggin Query:</label>
                <input type="text" id="debug" name="debug"/>
                <div className="checkout_button" onClick={() => {debugging();}}>Debug!</div>
            </form>
            */}
		</div>
  	);
}

export default CustomerPurchasePage;