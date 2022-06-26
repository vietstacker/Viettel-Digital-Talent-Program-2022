from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

def get_db():
    client = MongoClient(
        host='mongo',
        port=27017,
        username='root',
        password='pass',
        authSource="admin"
    )
    db=client['VDT22']
    return db

@app.route('/api/')
def get_vdt_db():
    db=""
    try:
        db=get_db()
        _attendees=db.attendees.find()
        print(list(_attendees))
        attendees=[{
            "stt": stu["No"],
            "name":stu["Name"],
            "yearOfBirth":stu["Year Of Birth"],
            "school":stu["School"],
            "major":stu["Major"]
            } for stu in _attendees]
        return jsonify({"attendees": attendees})
    except:
        pass
    finally:
        if type(db)==MongoClient:
            db.close()
    return "hello"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)