from flask import Flask
from flask import jsonify
import pymongo
from bson.json_util import dumps

client = pymongo.MongoClient('mongodb://web_mongo:27017/', username='admin', password='Phananh272')

db = client["class"]

col = db['attendee']

app = Flask(__name__)

@app.route('/api/attendees', methods = ['GET'])
def get_attendee():
    res = []
    for x in col.find():
        res.append(x)
    return jsonify(dumps(res))