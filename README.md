Project Outbreak

Goal: 
Examine any correlations between world health epidemics and on global stock markets (US, UK and Asia).  Visualize any major market fluctuations which may have been due to worldwide illnesses and health scares.

Epidemic Data 
Outbreak of the Epidemic based on Year, Month
Number of cases reported
Impact on state (if US) or country (non US)
Country GeoJson
Geodata data package provides geojson polygons for all the world's countries.
Stock Data (US/UK)
Time Series chart of Major Stock Market Indexes over time
Major Market indexes…  U.S. (Dow Jones Industrial, S&P500, Nasdaq), U.K. (FTSE100), Japan (Nikkei 225), Hong Kong (Heng Seng)
Open, High, Low, Close and Volume
	
Datasets :
Zika:https://www.kaggle.com/cdc/zika-virus-epidemic/version/1#
Ebola:https://www.kaggle.com/imdevskp/ebola-outbreak-20142016-complete-dataset
SARS:https://www.kaggle.com/imdevskp/sars-outbreak-2003-complete-dataset#sars_2003_complete_dataset_clean.csv
Cholera(Yamen):https://www.kaggle.com/tentotheminus9/yemen-data#Yemen%20Cholera%20Outbreak%20Epidemiology%20Data%20-%20Data_Country_Level.csv
Country GeoJson: https://github.com/datasets/geo-countries/blob/master/data/countries.geojson
COVID19 vs SARS vs MERS vs EBOLA vs H1N1
https://www.kaggle.com/imdevskp/covid19-vs-sars-vs-mers-vs-ebola-vs-h1n1/comments#763757


New Libraries: (Planned to use, not used currently)
Fusion.js : https://www.fusioncharts.com/fusiontime/examples/update-chart-using-api-methods
Chart.js: https://www.chartjs.org/



Market Indexes (add API Keys):

Time Series stock market information to be sourced from Alpha Vantage.  A provider of free API’s for real-time and historical stock market data.


Dow Jones Industrial (U.S.)
https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=DJI&outputsize=full&apikey=

Nikkei 225 (Japan)
https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=^N225&outputsize=full&apikey=

FTSE100 (U.K)
https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=^FTSE&outputsize=full&apikey=

S&P 500 (U.S)
https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=^GSPC&outputsize=full&apikey=

Hang Seng (Hong Kong)
https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=^HSI&outputsize=full&apikey=


GitHub Link:
https://github.com/maheshdivan/project-outbreak

Instruction for local data load:
Clone the repo:  https://github.com/maheshdivan/project-outbreak

To perform local data load:
 Open pgadmin and create one database
Marketing_db
Multiple files for ETL:
/ETL/ETL-Ebola_v3.ipynb
/ETL/market.ipynb
Openl files in Jupyter Notebook and edit to account for local data file source and database connection string:
epidemic_zika='/path/to/cdc_zika.csv'
market_data='path/to/markets.csv'
Rds_connection_string = "pgadminID:pgadminPWD@localhost:5432/marketing_db"
Open /API/Market/app.py and edit to account for local connection to local postgres DB
conn = psycopg2.connect(host='localhost',user='postgres',password='postgres',dbname='marketing_db')
Run “python app.py” for local Flask server.  All visualizations can pull data from`http://127.0.0.1:5000`;


Technical Architecture









Rough Sketch:



Technical Design:

Perform Extract, Transform and Load of the Data into PGAdmin 4. 

Epidemic : Ebola




	Corona Table:

		


	
SARS Table:



	


	
	Market Data:
		

Data Munging:




Flask API:

project-outbreak/API/Market/





Data Visualizations

project-outbreak/static/js/

Leaflet


Plotly Epidemic Graph:




Plotly Market Graph:





