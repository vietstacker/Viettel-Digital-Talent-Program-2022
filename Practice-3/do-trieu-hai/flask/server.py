from flask import Flask, render_template, request, url_for, redirect
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient('localhost', 27017, username='username', password='password')
db = client.db


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