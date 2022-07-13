'''
import math
import sqlite3
import pandas
from flask import Flask, render_template, make_response
from flask import redirect, request, jsonify, url_for
from flask import stream_with_context, Response
import mysql.connector
from mysql.connector import errorcode

sqlite_uri = 'jam_database.db'
row_limit = 1000
app = Flask(__name__)

airport_data = []


@app.route('/', methods=['GET'])
def index():
    title = 'CS411: Sample Project 2'
    return render_template('index.html', title=title)


@app.route('/query', methods=['POST'])
def process_query():
    def make_valid(v):
        if v != v:
            return None
        else:
            return v
    sql = request.form['query_string']
    syntax_check = sql.split(" ")
    query_head = {"insert": True, "select": True, "update": True, "delete": True}
    response = {
        "query_string": sql,
        "data": {}
    }
    if syntax_check[0].lower() not in query_head:
        print("ERROR: query syntax not correct")
        return response
    
    #con = sqlite3.connect(sqlite_uri)
    try:
        con = mysql.connector.connect(user='yutekuo2', password="myCS411!", host='localhost', database='jam_database')
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("++++++++++++++++++++Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("++++++++++++++++++++Database does not exist")
        else:
            print(err)
    else:
        con.close()

    con = mysql.connector.connect(user='yutekuo2', password="myCS411!", host='20.88.14.242', database='jam_database')
    #con = mysql.connector.connect(user='lz15', password="Zlp13676565566!", host='localhost', database='jam_database')
    print("HIHIHIHIH")
    if syntax_check[0].lower() == "insert" or syntax_check[0].lower() == "update" or syntax_check[0].lower() == "delete":
        cur = con.cursor()
        cur.execute(sql)
        con.commit()
        con.close()
    else: #select
        df = pandas.read_sql_query(sql, con).head(row_limit)
        con.close()
        column_labels = [col for col in df.columns]
        per_col_values = [
            [make_valid(value) for value in df[col]]
            for col in df.columns
        ]
        response = {
            "query_string": sql,
            "data": {
                "labels": [[col] for col in column_labels],
                "values": per_col_values
            }
        }

    print(response)
    return response

def insert_into_sqlite(csvfile):
    con = sqlite3.connect(sqlite_uri)
    cur = con.cursor()
    cur.execute(create table if not exists airports (
        IATA_CODE TEXT, 
        AIRPORT TEXT,
        CITY TEXT,
        STATE TEXT,
        COUNTRY TEXT,
        LATITUDE REAL,
        LONGITUDE REAL ))
    con.commit()
    df = pandas.read_csv(csvfile)
    df.to_sql('airports', con, if_exists='replace', index=False)
    con.commit()
    con.close()


if __name__ == '__main__':
    #insert_into_sqlite('data/airports.csv')
    app.run(host='0.0.0.0', port=10001, use_debugger=True, use_reloader=True)

'''
import math
import sqlite3
import pandas
from flask import Flask, render_template, make_response
from flask import redirect, request, jsonify, url_for
from flask import stream_with_context, Response


sqlite_uri = 'airports.db'
row_limit = 10000
app = Flask(__name__)

airport_data = []


@app.route('/', methods=['GET'])
def index():
    title = 'CS411: Sample Project 2'
    return render_template('index.html', title=title)


@app.route('/query', methods=['POST'])
def process_query():
    def make_valid(v):
        if v != v:
            return None
        else:
            return v
    sql = request.form['query_string']
    syntax_check = sql.split(" ")
    query_head = {"insert": True, "select": True, "update": True, "delete": True}
    response = {
        "query_string": sql,
        "data": {}
    }
    if syntax_check[0].lower() not in query_head:
        print("ERROR: query syntax not correct")
        return response
    
    con = sqlite3.connect(sqlite_uri)

    #con = mysql.connector.connect(user='yutekuo2', password="myCS411!", host='20.88.14.242', database='jam_database')
    #con = mysql.connector.connect(user='lz15', password="Zlp13676565566!", host='localhost', database='jam_database')
    if syntax_check[0].lower() == "insert" or syntax_check[0].lower() == "update" or syntax_check[0].lower() == "delete":
        cur = con.cursor()
        cur.execute(sql)
        con.commit()
        con.close()
    else: #select
        df = pandas.read_sql_query(sql, con).head(row_limit)
        con.close()
        column_labels = [col for col in df.columns]
        per_col_values = [
            [make_valid(value) for value in df[col]]
            for col in df.columns
        ]
        response = {
            "query_string": sql,
            "data": {
                "labels": [[col] for col in column_labels],
                "values": per_col_values
            }
        }

    print(response)
    return response

def insert_into_sqlite(tableName, csvfile):
    con = sqlite3.connect(sqlite_uri)
    cur = con.cursor()
    if tableName == "Customers":
        cur.execute('''create table if not exists Customers (
            customerId real,
            Name text ) ''')
        con.commit()
        df = pandas.read_csv(csvfile)
        df.to_sql('Customers', con, if_exists='replace', index=False) 

    elif tableName == "Products":
        cur.execute('''create table if not exists Products (
            productID text,
            storeName text,
            item text,
            price real ) ''')
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

    elif tableName == "Stores":
        cur.execute('''create table if not exists Stores (
            storeName text ) ''')
        con.commit()
        df = pandas.read_csv(csvfile)
        df.to_sql('Stores', con, if_exists='replace', index=False)

    con.commit()
    con.close()


if __name__ == '__main__':
    insert_into_sqlite("Customers", '../Customers.csv')
    insert_into_sqlite("Products", '../Products.csv')
    insert_into_sqlite("Purchases", '../Purchases.csv')
    #insert_into_sqlite("Stores", '../Stores.csv')
    app.run(host='0.0.0.0', port=10001, use_debugger=True, use_reloader=True)
