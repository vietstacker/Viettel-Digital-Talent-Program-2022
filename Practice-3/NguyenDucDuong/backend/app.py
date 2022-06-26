import datetime
import os

from flask import Flask, Response, request
from flask_mongoengine import MongoEngine
from flask_restful import Api
from flask_cors import CORS, cross_origin

from database.db import initialize_db
from database.models import Student
from api.routes import initialize_routes

app = Flask(__name__)
cors = CORS(app)
api = Api(app)

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['MONGODB_SETTINGS'] = {
    'host': os.environ['MONGODB_HOST'],
    'username': os.environ['MONGODB_USERNAME'],
    'password': os.environ['MONGODB_PASSWORD'],
    'db': os.environ['MONGODB_DBNAME'],
    'authentication_source': os.environ['MONGODB_AUTH_SOURCE'],
}

# app.config['MONGODB_SETTINGS'] = {
#         'DB': 'student-db',
#         'USERNAME': 'apiuser',
#         'PASSWORD': 'apipassword',
#         'HOST': 'localhost',
#         'PORT': 27017,
#         'authentication_source': 'student-db',
#     }

initialize_db(app)
initialize_routes(api)


if __name__ == "__main__":
    app.run(debug=True, port=5000)