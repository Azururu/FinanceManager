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
def update(budget_value, date):
    cursor = connection.cursor()
    try:
        sql_insert = "INSERT INTO balance (current, date) VALUES (%s, %s);"
        cursor.execute(sql_insert, (budget_value, date))
        result = cursor.fetchall()
        if result:
            return {"valid": "successful"}
        else:
            return {"valid": "failed"}
    finally:
        cursor.close()


# Endpoint for logging in to an account
@app.route('/login/<username>/<password>' , methods=['GET'])
def login(username, password):
    cursor = connection.cursor()
    try:
        sql_search = "SELECT * FROM account WHERE user = {%s};"
        sql_full_auth = "SELECT * FROM account WHERE user = {%s} AND password = {%s};"
        sql_insert = "INSERT INTO account (user, password) VALUES (%s, %s);"
        cursor.execute(sql_search, username)
        result = cursor.fetchall()
        if result:
            cursor.execute(sql_full_auth, (username, password))
            check = cursor.fetchall()
            if check:
                return {"valid": "successful"}
            else:
                return {"invalid": "failed"}
        if not result:
            cursor.execute(sql_insert, (username, password))
            return {"valid": "created"}
    finally:
        cursor.close()

# Endpoint for getting current balance
@app.route('/balance')
def available():
    sql_balance = "SELECT current FROM balance ORDER BY ID DESC LIMIT 1;"
    cursor = connection.cursor()
    cursor.execute(sql_balance)
    result = cursor.fetchall()
    return result


# Endpoint for getting the amount that have been spent
@app.route('/spent')
def spent():
    sql_budget = "SELECT current FROM balance WHERE ID = '1';"
    cursor = connection.cursor()
    cursor.execute(sql_budget)
    budget = cursor.fetchall()

    sql_current_balance = "SELECT current FROM balance ORDER BY ID DESC LIMIT 1;"
    cursor.execute(sql_current_balance)
    current_balance = cursor.fetchall()

    total = float(budget[0][0])
    current = float(current_balance[0][0])

    spent_since = current - total
    return str(spent_since)


# Endpoint for getting data for the budget start date
@app.route('/start_date')
def date():
    sql_start_date = "SELECT date FROM balance WHERE ID = '1';"
    cursor = connection.cursor()
    cursor.execute(sql_start_date)
    start_date = cursor.fetchone()

    if start_date and start_date[0]:
        formatted_date = start_date[0].strftime("%m/%d/%Y")
    else:
        formatted_date = None

    return jsonify({"start_date": formatted_date})

if __name__ == '__main__':
    app.run(use_reloader=True, host='localhost', port=3000)