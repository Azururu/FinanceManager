import mysql.connector
import dbpass
from flask import Flask, jsonify
from flask_cors import CORS

# Connection to database
connection = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd=dbpass.passkey,
    port=3306,
    database="spender",
    autocommit=True,
    charset='utf8mb4',
    collation='utf8mb4_unicode_ci'
)

app = Flask(__name__)

cors = CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'


# Endpoint for storing the budget and date to the database
@app.route('/budget/<budget_value>/<date>')
def submit(budget_value, date):
    cursor = connection.cursor()
    try:
        sql_insert = "INSERT INTO balance (current, date) VALUES (%s, %s);"
        cursor.execute(sql_insert, (budget_value, date))
        result = cursor.fetchall()
        if result:
            return {"result": "successful"}
        else:
            return {"result": "failed"}
    finally:
        cursor.close()

# Endpoint for subtracting an amount from the available amount
@app.route('/update/<update_value>/<date>')
def update(update_value, date):
    cursor = connection.cursor()
    try:
        sql_search = "SELECT current FROM balance ORDER BY ID DESC LIMIT 1;"
        cursor.execute(sql_search)
        search_result = cursor.fetchall()
        subtraction = float(search_result[0][0]) - float(update_value)
        str_subtraction = str(subtraction)
        sql_insert_subtraction = "INSERT INTO balance (current, date) VALUES (%s, %s);"
        cursor.execute(sql_insert_subtraction, (str_subtraction, date))
        update_result = cursor.fetchall()
        if update_result:
            return {"result": "successful"}
        else:
            return {"result": "failed"}
    finally:
        cursor.close()


# Endpoint for logging in to an account
@app.route('/login/<username>/<password>' , methods=['GET'])
def login(username, password):
    cursor = connection.cursor()
    try:
        sql_search = "SELECT * FROM account WHERE user = %s;"
        sql_full_auth = "SELECT * FROM account WHERE user = %s AND password = %s;"
        cursor.execute(sql_search, username)
        username_result = cursor.fetchone()
        if username_result:
            cursor.execute(sql_full_auth, (username, password))
            check_result = cursor.fetchall()
            if check_result:
                return {"result": "successful"}
            else:
                return {"result": "failed"}
        else:
            return {"result": "failed"}
    finally:
        cursor.close()

@app.route('/register/<username>/<password>/<password_conf>' , methods=['GET'])
def register(username, password, password_conf):
    cursor = connection.cursor()
    try:
        if password == password_conf:
            sql_insert = "INSERT INTO account (user, password) VALUES (%s, %s);"
            cursor.execute(sql_insert, (username, password))
            result = cursor.fetchall()
            if result:
                return {"result": "successful"}
            else:
                return {"result": "failed"}
        else:
            return {"result": "failed"}
    finally:
        cursor.close()

# Endpoint for getting current balance
@app.route('/balance')
def available():
    cursor = connection.cursor()
    try:
        sql_balance = "SELECT current FROM balance ORDER BY ID DESC LIMIT 1;"
        cursor.execute(sql_balance)
        result = cursor.fetchall()
        float_result = float(result[0][0])
        return f"{float_result:.2f}"
    finally:
        cursor.close()

@app.route('/history_check')
def check():
    cursor = connection.cursor()
    try:
        sql_check = "SELECT * FROM balance WHERE ID = '1';"
        cursor.execute(sql_check)
        check_result = cursor.fetchall()
        if check_result:
            return {"result": "valid"}
        else:
            return {"result": "invalid"}
    finally:
        cursor.close()

# Endpoint for getting the amount that have been spent
@app.route('/spent')
def spent():
    cursor = connection.cursor()
    try:
        sql_budget = "SELECT current FROM balance WHERE ID = '1';"
        cursor.execute(sql_budget)
        budget = cursor.fetchall()

        sql_current_balance = "SELECT current FROM balance ORDER BY ID DESC LIMIT 1;"
        cursor.execute(sql_current_balance)
        current_balance = cursor.fetchall()

        total = float(budget[0][0])
        current = float(current_balance[0][0])

        spent_since = current - total
        return f"{spent_since:.2f}"
    finally:
        cursor.close()


# Endpoint for getting data for the budget start date
@app.route('/start_date')
def date():
    cursor = connection.cursor()
    try:
        sql_start_date = "SELECT date FROM balance WHERE ID = '1';"
        cursor.execute(sql_start_date)
        start_date = cursor.fetchone()

        if start_date and start_date[0]:
            formatted_date = start_date[0].strftime("%m/%d/%Y")
        else:
            formatted_date = None

        return jsonify({"start_date": formatted_date})
    finally:
        cursor.close()

if __name__ == '__main__':
    app.run(use_reloader=True, host='localhost', port=3000)