from flask import Flask
from pymongo import MongoClient
from flask import request
from flask_cors import CORS, cross_origin
from bson.json_util import dumps


client = MongoClient('mongo:27017')
db = client.VDT2022

app = Flask(__name__)
CORS(app)

@app.route("/", methods = ['GET'])
def get():
    return dumps("hello")

@app.route("/get_all", methods = ['GET'])
def get_all():
    try:
        attendees = db.attendees.find()
        return dumps(attendees)
    except Exception as e:
        return dumps({'error' : str(e)})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000) 