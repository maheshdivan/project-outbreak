import psycopg2
from flask import Flask, jsonify



app = Flask(__name__)

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
    )

@app.route("/api/v1.0/index/<index>")
def market(index):
    print(index)
    try:
        cur.execute('SELECT * FROM index_table where ticker=%s',[index])
        values = cur.fetchall()

        if values != []:
           return (jsonify(values))
        else:
            return ("<h3> No row found for </h3>"+index)   

    except TypeError :
        print("I am here")
        return (f"<h2>An error occured</h2>")


@app.route("/api/v1.0/epidemic/ebola")
def epidemic():
    try:
        cur.execute('SELECT * FROM ebola_epidemic')
        values1 = cur.fetchall()

        if values1 != []:
           return (jsonify(values1))
        else:
            return ("<h3> No row found for epidemic</h3>")   

    except TypeError :
        print("I am here")
        return (f"<h2>An error occured</h2>")


            
        

if __name__ == '__main__':
    app.run(debug=True)
