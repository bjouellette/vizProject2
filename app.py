from flask import Flask, jsonify, render_template
import pandas as pd
from sqlalchemy import create_engine
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

happiness_engine = create_engine(f"postgresql://postgres:postgres@localhost:5432/vizProject2")
happiness_connect = happiness_engine.connect()

# Create an instance of Flask
app = Flask(__name__)

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(happiness_engine, reflect = True)
happy_base = Base.classes.keys()
print(happy_base)

happyData = Base.classes.world_happiness_data

session = Session(happiness_engine)

@app.route("/")
def home():
    # Find one record of data from the postgres database
    # destination_data = mongo.db.collection.find_one()
    # Return template and data
    return (
        f"Welcome to the world happiness data webpage. <br>"
        f"/api/v1.0/happiness"
    )

@app.route("/api/v1.0/happiness")
def happiness():
    happiness_data = session.query(happyData.country).all()
    return jsonify(happiness_data)

if __name__ == "__main__": 
    app.run(debug = True)