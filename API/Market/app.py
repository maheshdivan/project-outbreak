import psycopg2
from flask import Flask, jsonify
from flask_cors import CORS



app = Flask(__name__)
CORS(app)

# conn = psycopg2.connect(host='localhost',user='mahesh1',password='mahesh',dbname='marketing_db')
conn = psycopg2.connect(host='localhost',user='mahesh1',password='mahesh',dbname='marketing_db')
cur = conn.cursor()


@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"<h2>Welcome to Market & Epidemic API </h2><br/>"
        f"Available Routes:<br/>"
        f"/api/v1.0/index/<n><br/>"
        f"n=DJI,FTSE,GSPC,N225,HSI"
        f"<br>   </br>"
        f"/api/v1.0/epidemic/ebola<br/>"
        f"/api/v1.0/epidemic/corona<br/>"
        f"/api/v1.0/epidemic/sars<br/>"
    )

@app.route("/api/v1.0/index/market")
def market():
    print()
    try:
        cur.execute('SELECT * FROM index_table')
        values = cur.fetchall()

        if values != []:
           return (jsonify(values))
        else:
            return ("<h3> No row found for </h3>")   

    except TypeError :
        print("I am here")
        return (f"<h2>An error occured</h2>")


@app.route("/api/v1.0/epidemic/ebola")
def epidemic_e():
    try:
        cur.execute('SELECT * FROM ebola_epidemic')
        values1 = cur.fetchall()

        if values1 != []:
           return (jsonify(values1))
        else:
            return ("<h3> No row found for epidemic ebola</h3>")   

    except TypeError :
        print("I am here")
        return (f"<h2>An error occured</h2>")


@app.route("/api/v1.0/epidemic/corona")
def epidemic_c():
    try:
        cur.execute('SELECT * FROM corona1_epidemic')
        values1 = cur.fetchall()

        if values1 != []:
           return (jsonify(values1))
        else:
            return ("<h3> No row found for epidemic corona</h3>")   

    except TypeError :
        print("I am here") 
        return (f"<h2>An error occured</h2>")     

@app.route("/api/v1.0/epidemic/sars")
def epidemic_s():
    try:
        cur.execute('SELECT * FROM sars_epidemic')
        values1 = cur.fetchall()

        if values1 != []:
           return (jsonify(values1))
        else:
            return ("<h3> No row found for epidemic sars</h3>")   

    except TypeError :
        print("I am here")    
        return (f"<h2>An error occured</h2>")               
        

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False)
