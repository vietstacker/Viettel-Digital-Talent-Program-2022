from flask import Flask, jsonify, request, render_template, json
from pymongo import MongoClient
from flask_cors import CORS, cross_origin
app = Flask(__name__)
CORS(app, support_credentials=True)
client = MongoClient('mongodb://mongodb:27017/')
db = client["GFG"]

collection = db["students"]

@app.route('/', methods = ['GET'])
def index():
    listStudents = db.students.find()

    item = {}
    data = []
    for element in listStudents:
        item = {
            'id': str(element['_id']),
            'stt': str(element['stt']),
            'name': str(element['name']),
            'birth': str(element['birth']),
            'university': str(element['university']),
            'major': str(element['major'])
        }
        data.append(item)

    return jsonify(
        data
    )

@app.route('/student', methods = ['POST'])
def student():
    req_data = request.get_json()
    lists = req_data['lists']
    collection.insert_many(lists)

    return 'Saved!', 201