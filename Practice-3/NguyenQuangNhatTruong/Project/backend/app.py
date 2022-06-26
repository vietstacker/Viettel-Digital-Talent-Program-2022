from flask import Flask
from flask import request
from pymongo import MongoClient
from flask_cors import CORS
from bson.json_util import dumps

client = MongoClient(
        host='mongo',
        port=27017,
        username='myUserAdmin',
        password='abc123',
        authSource="admin"
)
db = client["datasource"]

app = Flask(__name__)
CORS(app)

@app.route("/get_all", methods = ['GET'])
def get_all():
    try:
        users = db["member"].find()
        return dumps(users)
    except:
        return "Error"

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000) 