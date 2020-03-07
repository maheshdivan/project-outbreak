import psycopg2
from flask import Flask, jsonify



app = Flask(__name__)

conn = psycopg2.connect(host='localhost',user='mahesh1',password='mahesh',dbname='marketing_db')
cur = conn.cursor()
cur.execute('SELECT * FROM index_table')
one = cur.fetchone()



@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"<h2>Welcome to Market Watch API </h2><br/>"
        f"Available Routes:<br/>"
        f"/api/v1.0/index/<n><br/>"
        f"n=DJI,FTSE,GSPC,N225,HSI"
    )

@app.route("/api/v1.0/index/<index>")
def marketika(index):
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
            
        

if __name__ == '__main__':
    app.run(debug=True)
