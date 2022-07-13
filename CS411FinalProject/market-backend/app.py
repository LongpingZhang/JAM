import math
import sqlite3
import pandas
from flask import Flask, render_template, make_response
from flask import redirect, request, jsonify, url_for
from flask import stream_with_context, Response
import mysql.connector

sqlite_uri = 'airports.db'
row_limit = 10000
app = Flask(__name__)

airport_data = []

@app.route('/login', methods=['GET']) #OK!
def getLoginInfo():
    r = request.args
    sql = r['queryString']
    print("========EXEC SQL QUERY=======", sql)

    #connection = sqlite3.connect(sqlite_uri)
    connection = mysql.connector.connect(user="lz15", password="Zlp13676565566!", host="localhost", port="3306", database="jam_database")
    cursor = connection.cursor()
    cursor.execute(sql)
    records = cursor.fetchall()
    if not records:
        return jsonify(success=False)
    connection.close()
    response = {
        "query_string": sql,
        "data": {
            "userID": records[0][0],
            "password": str(records[0][1]),
            "userType": records[0][2]
        }
    }
    #print(response)
    return response

@app.route('/signup', methods=['POST'])
def postSignUpInfo():
    r = request.get_json()
    userID = r['userID']
    password = r['password']
    firstName = r['firstName']
    lastName = r['lastName']
    address = r['address']
    userType = r['userType']
    sql = "INSERT INTO Users VALUES (\"" + userID + "\", \"" + password + "\", \"" + userType + "\", \"" + firstName + "\", \"" + lastName + "\", \"" + address +"\");"
    #new_data = (userID, password, userType, firstName, lastName, address)
    print("========EXEC signup SQL QUERY=======", sql)

    #connection = sqlite3.connect(sqlite_uri)
    connection = mysql.connector.connect(user="lz15", password="Zlp13676565566!", host="localhost", port="3306", database="jam_database")
    cursor = connection.cursor()
    #cursor.execute(sql, new_data)
    cursor.execute(sql)
    connection.commit()
    connection.close()
    resp = jsonify(success=True)
    return resp

@app.route('/customer/online-purchase', methods=['GET']) #OK!
def getAllProduct():
    r = request.args
    sql = r['queryString']
    print("========EXEC SQL QUERY=======", sql)

    #connection = sqlite3.connect(sqlite_uri)
    connection = mysql.connector.connect(user="lz15", password="Zlp13676565566!", host="localhost", port="3306", database="jam_database")
    cursor = connection.cursor()
    cursor.execute(sql)
    records = cursor.fetchall()
    if not records:
        return jsonify(success=False)
    connection.close()
    response = {
        "query_string": sql,
        "data": records
    }
    return response

@app.route('/customer/online-purchase', methods=['POST']) #OK!
def insert_online_purchase():
    r = request.get_json()
    qType = r['queryType']
    sql = ""
    new_data = None
    if (qType == "handleInsertCarts"): #Insert Into Cart Table
        userID = r['data']['customerID']
        productID = r['data']['productID']
        storeName = r['data']['storeName']
        item = r['data']['item']
        price = r['data']['price']
        quantity = r['data']['quantity']
        sql = "INSERT INTO Cart (customerID, productID, storeName, item, price, quantity) VALUES (" + str(userID) + ", \"" + productID + "\", \"" + storeName + "\", \"" + item + "\", " + str(price) + ", " + str(quantity) + ");"
        print("========EXEC SQL QUERY=======", sql)
        #sql = "INSERT OR REPLACE INTO Cart (customerID, productID, storeName, quantity) VALUES (?, ?, ?, ?);"
        #new_data = (userID, productID, storeName, quantity)
    
    elif (qType == "handleInsertPurchases"): #Insert Into Purchases Table
        #sql = "INSERT INTO Purchases (purchaseID, customerID, date) VALUES (?, ?, ?);"
        purchaseID = r['data']['purchaseID']
        customerID = r['data']['customerID']
        date = r['data']['date']
        sql = "INSERT INTO Purchases (purchaseID, customerID, date) VALUES (" + str(purchaseID) + ", " + str(customerID) + ", \"" + str(date) + "\");"
        print("========EXEC SQL QUERY=======", sql)
        #new_data = (purchaseID, customerID, date)
    
    elif (qType == "handleInsertIncludes"): #Insert Into Include Table
        #sql = "INSERT INTO Include (purchaseID, productID, storeName, quantity) VALUES (?, ?, ?, ?);"
        purchaseID = r['data']['purchaseID']
        productID = r['data']['productID']
        storeName = r['data']['storeName']
        quantity = r['data']['quantity']
        sql = "INSERT INTO Include (purchaseID, productID, storeName, quantity) VALUES (" + str(purchaseID) + ", \"" + productID + "\", \"" + storeName + "\", " + str(quantity) + ");"    
        print("========EXEC SQL QUERY=======", sql)
        #new_data = (purchaseID, productID, storeName, quantity)
        #print("+++++++PurchaseID======", purchaseID)
    
    elif (qType == "handleUpdateProducts"): #Update Products Table
        '''
        Transaction
        '''
        connection = mysql.connector.connect(user="lz15", password="Zlp13676565566!", host="localhost", port="3306", database="jam_database")
        cursor = connection.cursor()
        productID = r['productID']
        storeName = r['storeName']
        get_inventory = "select inventory from Products where productID = \"" + productID + "\" and storeName = \"" + storeName + "\";"
        #new_data = (productID, storeName)
        cursor.execute(get_inventory)
        inventory = cursor.fetchall()
        cursor.close()
        final_list = []
        for t in inventory:
            for n in t:
                final_list.append(n)
        for n in final_list:
            if (n < 1):
                part1 = "start transaction isolation level read committed; "
                part2 = "UPDATE Products set inventory = inventory - 1 WHERE productID = \"" + productID + "\" AND storeName = \"" + storeName + "\"; "
                part3 = "rollback;"
                sql = part1 + part2 + part3
            else:
                sql = "UPDATE Products set inventory = inventory - 1 WHERE productID = \"" + productID + "\" AND storeName = \"" + storeName + "\";"
        '''
        ====
        '''
        '''
        productID = r['productID']
        storeName = r['storeName']
        #new_data = (productID, storeName)
        sql = "UPDATE Products set inventory = inventory - 1 WHERE productID = \"" + productID + "\" AND storeName = \"" + storeName + "\";"
        print("========EXEC SQL QUERY=======", sql)
        #"UPDATE Products p join Cart c on p.productID = c.productID and p.storeName = c.storeName set inventory = inventory - quantity;"'''
    
    elif (qType == "handleDeleteCarts"): #Delete Carts Table
        userID = r['data']['userID']
        sql = "DELETE FROM Cart WHERE customerID = \"" + userID + "\";"
        #new_data = (userID,)

    else:
        sql = r['queryString']
        print("========EXEC SQL QUERY=======", sql)
        #connection = sqlite3.connect(sqlite_uri)
        connection = mysql.connector.connect(user="lz15", password="Zlp13676565566!", host="localhost", port="3306", database="jam_database")
        cursor = connection.cursor()
        cursor.execute(sql)
        connection.commit()
        connection.close()
        resp = jsonify(success=True)
        return resp

    #connection = sqlite3.connect(sqlite_uri)
    connection = mysql.connector.connect(user="lz15", password="Zlp13676565566!", host="localhost", port="3306", database="jam_database")
    cursor = connection.cursor()
    cursor.execute(sql)
    connection.commit()
    connection.close()
    resp = jsonify(success=True)
    return resp

@app.route('/customer/purchase-history', methods=['GET'])
def getPurchaseHistory():
    r = request.args
    customerID = r['userID']
    sql = "SELECT * FROM Purchases NATURAL JOIN Include JOIN Products ON Include.productID = Products.productID AND Include.storeName = Products.storeName WHERE customerID = \"" + customerID + "\";"
    print(sql)

    #connection = sqlite3.connect(sqlite_uri)
    connection = mysql.connector.connect(user="lz15", password="Zlp13676565566!", host="localhost", port="3306", database="jam_database")
    cursor = connection.cursor()
    cursor.execute(sql)
    records = cursor.fetchall()
    connection.close()
    response = {
        "query_string": sql,
        "data": records
    }
    print("!!!!!!!!!!!!!purchase-history GET", records)
    return response

@app.route('/customer/account-info', methods=['GET'])
def getAccountInfo():
    r = request.args
    userID = r['userID']
    sql = "SELECT * FROM Users WHERE userID = \"" + userID + "\";"
    print(sql)

    #connection = sqlite3.connect(sqlite_uri)
    connection = mysql.connector.connect(user="lz15", password="Zlp13676565566!", host="localhost", port="3306", database="jam_database")
    cursor = connection.cursor()
    cursor.execute(sql)
    records = cursor.fetchall()
    connection.close()
    response = {
        "query_string": sql,
        "data": records
    }
    print("!!!!+++++getAccountInfo", records)
    return response

@app.route('/manager/check-inventories', methods=['GET']) #OK!
def getInventories():
    r = request.args
    storeName = r['storeName']
    sql = "select storeName, productID, item, inventory from Products where storeName = \"" + storeName + "\";"
    print(sql)

    #connection = sqlite3.connect(sqlite_uri)
    connection = mysql.connector.connect(user="lz15", password="Zlp13676565566!", host="localhost", port="3306", database="jam_database")
    cursor = connection.cursor()
    cursor.execute(sql)
    records = cursor.fetchall()
    connection.close()
    response = {
        "query_string": sql,
        "data": records
    }
    return response

@app.route('/manager/check-inventories', methods=['POST']) #OK!
def monitor_sales():
    r = request.get_json()
    qType = r['queryType']
    sql = ""
    if (qType == "checkInventories"):
        productID = r['productID']
        storeName = r['storeName']
        item = r['item']
        price = r['price']
        inventory = r['inventory']
        sql = "INSERT into Products(productID, storeName, item, price, inventory) values (\"" + productID + "\", \"" + storeName + "\", \"" + item + "\", \"" + price + "\", \"" + inventory + "\");"
        #sql = "insert into Products(productID, storeName, item, price, inventory) values(?, ?, ?, ?, ?);"
        #new_data = (productID, storeName, item, price, inventory)
        print("+--___-_____", sql)
    
    elif (qType == "updateAProduct"): #Insert Into Purchases Table
        productID = r['productID']
        storeName = r['storeName']
        inventory = r['inventory']
        sql = "update Products set inventory = \"" + inventory + "\" where productID = \"" + productID + "\" and storeName = \"" + storeName +"\";"
        #new_data = (inventory, productID, storeName)

    #connection = sqlite3.connect(sqlite_uri)
    connection = mysql.connector.connect(user="lz15", password="Zlp13676565566!", host="localhost", port="3306", database="jam_database")
    cursor = connection.cursor()
    cursor.execute(sql)
    connection.commit()
    connection.close()
    resp = jsonify(success=True)
    return resp

@app.route('/manager/monitor-sales', methods=['GET']) #OK!
def getSales():
    r = request.args
    storeName = r['storeName']
    sql = "select p.storeName storeName, sum(quantity * price) sales from Include i join Products p on i.productID = p.productID and i.storeName = p.storeName where p.storeName = \"" + storeName + "\";"
    #connection = sqlite3.connect(sqlite_uri)
    connection = mysql.connector.connect(user="lz15", password="Zlp13676565566!", host="localhost", port="3306", database="jam_database")
    cursor = connection.cursor()
    cursor.execute(sql)
    records = cursor.fetchall()
    connection.close()
    print("+++++++++++++++++++++", records)
    response = {
        "query_string": sql,
        "data": records
    }
    return response

@app.route('/manager/customer-stats', methods=['GET']) #OK!
def getCustomerStats():
    r = request.args
    storeName = r['storeName']
    sql = "select distinct storeName, customerID, name from Customers natural join Purchases natural join Include " \
          "where storeName = \"" + storeName + "\";"
    
    print(sql)

    #connection = sqlite3.connect(sqlite_uri)
    connection = mysql.connector.connect(user="lz15", password="Zlp13676565566!", host="localhost", port="3306", database="jam_database")
    cursor = connection.cursor()
    cursor.execute(sql)
    records = cursor.fetchall()
    connection.close()
    response = {
        "query_string": sql,
        "data": records
    }
    return response


def insert_into_sqlite(tableName, csvfile):
    con = sqlite3.connect(sqlite_uri)
    cur = con.cursor()
    if tableName == "Customers":
        cur.execute('''create table if not exists Customers (
            customerID real,
            name text ) ''')
        con.commit()
        df = pandas.read_csv(csvfile)
        df.to_sql('Customers', con, if_exists='replace', index=False) 

    elif tableName == "Products":
        cur.execute('''create table if not exists Products (
            productID text,
            storeName text,
            item text,
            price real,
            inventory real ) ''')
        con.commit()
        df = pandas.read_csv(csvfile)
        df.to_sql('Products', con, if_exists='replace', index=False)

    elif tableName == "Purchases":
        cur.execute('''create table if not exists Purchases (
            purchaseID real,
            customerID real,
            date text ) ''')
        con.commit()
        df = pandas.read_csv(csvfile)
        df.to_sql('Purchases', con, if_exists='replace', index=False)
    
    elif tableName == "Include":
        cur.execute('''create table if not exists Include (
            purchaseID real,
            productID text,
            storeName text,
            quantity real) ''')
        con.commit()
        df = pandas.read_csv(csvfile)
        df.to_sql('Include', con, if_exists='replace', index=False)

    elif tableName == "Cart":
        cur.execute('''create table if not exists Cart (
            customerID real,
            productID text,
            storeName text,
            quantity real ) ''')
        con.commit()
        df = pandas.read_csv(csvfile)
        df.to_sql('Cart', con, if_exists='replace', index=False)

    elif tableName == "Users":
        cur.execute('''create table if not exists Users (
            userID real,
            passward text,
            userType text,
            firstName text,
            lastName text,
            address text) ''')
        con.commit()
        df = pandas.read_csv(csvfile)
        df.to_sql('Users', con, if_exists='replace', index=False)

    elif tableName == "Stores":
        cur.execute('''create table if not exists Stores (
            storeName text ) ''')
        con.commit()
        df = pandas.read_csv(csvfile)
        df.to_sql('Stores', con, if_exists='replace', index=False)

    con.commit()
    con.close()

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response


if __name__ == '__main__':
    '''
    insert_into_sqlite("Customers", '../Customers.csv')
    insert_into_sqlite("Products", '../Products.csv')
    insert_into_sqlite("Purchases", '../Purchases.csv')
    insert_into_sqlite("Include", '../Include.csv')
    insert_into_sqlite("Cart", '../Cart.csv')
    insert_into_sqlite("Users", '../Users.csv')
    '''

    #insert_into_sqlite("Stores", '../Stores.csv')
    app.run(host='0.0.0.0', port=10046, use_debugger=True, use_reloader=True)