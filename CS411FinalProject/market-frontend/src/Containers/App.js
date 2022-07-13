import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import React, { useState, useEffect } from 'react';

import './App.scss';
import HomePage from '../Components/HomePage';
import LoginPage from '../Components/LoginPage';
import SignUpPage from '../Components/SignUpPage';
import CustomerPage from '../Components/CustomerPage';
import CustomerPurchasePage from '../Components/CustomerPurchasePage';
import CustomerAccountInfoPage from '../Components/CustomerAccountInfoPage';
import CustomerPurchaseHistoryPage from '../Components/CustomerPurchaseHistoryPage';
import ManagerPage from '../Components/ManagerPage';
import ManagerInventoryPage from '../Components/ManagerInventoryPage';
import ManagerSalesPage from '../Components/ManagerSalesPage';
import ManagerStatsPage from '../Components/ManagerStatsPage';

function App() {
	const [mode, setMode] = useState(0); //0: home, 1: Customer, 2: Manager
	const [isLogin, setIsLogin] = useState(false);
    const [userID, setUserID] = useState("");
	/*
	useEffect(() => {
        
    }, []);
	*/

	return (
		<div className="App">
			<Router>
				<Switch>
					<Route exact path="/">
						<HomePage mode={mode} setMode={setMode} isLogin={isLogin} setIsLogin={setIsLogin}/>
					</Route>
					<Route exact path="/login">
						<LoginPage mode={mode} setMode={setMode} isLogin={isLogin} setIsLogin={setIsLogin} userID={userID} setUserID={setUserID}/>
					</Route>
					<Route exact path="/signup">
						<SignUpPage mode={mode} setMode={setMode}/>
					</Route>
					<Route exact path="/customer">
						<CustomerPage mode={mode} setMode={setMode} setIsLogin={setIsLogin} setUserID ={setUserID}/>
					</Route>
					<Route exact path="/customer/online-purchase">
						<CustomerPurchasePage mode={mode} setMode={setMode} userID={userID} setIsLogin={setIsLogin} setUserID ={setUserID}/>
					</Route>
					<Route exact path="/customer/account-info">
						<CustomerAccountInfoPage mode={mode} setMode={setMode} userID={userID} setIsLogin={setIsLogin} setUserID ={setUserID}/>
					</Route>
					<Route exact path="/customer/purchase-history">
						<CustomerPurchaseHistoryPage mode={mode} setMode={setMode} userID={userID} setIsLogin={setIsLogin} setUserID ={setUserID}/>
					</Route>
					<Route exact path="/manager" >
						<ManagerPage mode={mode} setMode={setMode} setIsLogin={setIsLogin} setUserID ={setUserID}/>
					</Route>
					<Route exact path="/manager/check-inventories" >
						<ManagerInventoryPage mode={mode} setMode={setMode} setIsLogin={setIsLogin} setUserID ={setUserID}/>
					</Route>
					<Route exact path="/manager/monitor-sales" >
						<ManagerSalesPage mode={mode} setMode={setMode} setIsLogin={setIsLogin} setUserID ={setUserID}/>
					</Route>
					<Route exact path="/manager/customer-stats" >
						<ManagerStatsPage mode={mode} setMode={setMode} setIsLogin={setIsLogin} setUserID ={setUserID}/>
					</Route>
				</Switch>
			</Router>
		</div>
  	);
}





export default App;
