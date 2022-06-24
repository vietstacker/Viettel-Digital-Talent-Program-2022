import os
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo

application = Flask(__name__)

application.config["MONGO_URI"] = 'mongodb://' + os.environ['MONGODB_USERNAME'] + ':' + os.environ['MONGODB_PASSWORD'] + '@' + os.environ['MONGODB_HOSTNAME'] + ':27017/' + os.environ['MONGODB_DATABASE']

mongo = PyMongo(application)
db = mongo.db


@app.route('/', methods = ['GET'])
def index():
    students = db.students.find()

    item = {}
    data = []
    for student in students:
        item = {
            'id': str(student['_id']),
            'num': str(student['num']),
            'name': str(student['name']),
            'year': str(student['year']),
            'university': str(student['university']),
            'major': str(student['major'])
        }
        data.append(item)

    return jsonify(
        status=True,
        data
    )

@app.route('/', methods=('GET', 'POST'))
def all():
    return render_template('index.html')


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=ENVIRONMENT_DEBUG)