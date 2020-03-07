import psycopg2
from flask import Flask, jsonify



app = Flask(__name__)

conn = psycopg2.connect(host='localhost',user='mahesh1',password='mahesh',dbname='epidemic_db')
cur = conn.cursor()
cur.execute('SELECT * FROM zika_epidemic')
one = cur.fetchone()



@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"<h2>Welcome to Epidemic API </h2><br/>"
        f"Available Routes:<br/>"
        f"/api/v1.0/zika<br/>"
        f"/api/v1.0/ebola<br>"
        f"/api/v1.0/cholerea<br>"
        f"/api/v1.0/corona<br>"
        f"/api/v1.0/sars/<end>"
    )

@app.route("/api/v1.0/zika/<start>")
def zika(start):
    print(start)
    
    date=start.replace("-","/")
    print(date)
    try:
        cur.execute('SELECT * FROM zika_epidemic where report_date=%s',[date])
        values = cur.fetchall()

        if values != []:
           return (jsonify(values))
        else:
            return ("<h3> No row returned for </h3>"+date)   

    except TypeError :
        print("I am here")
        return (f"<h2>An error occured</h2>")
            
        

if __name__ == '__main__':
    app.run(debug=True)
