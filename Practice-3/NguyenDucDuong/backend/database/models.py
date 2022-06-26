from .db import db

class Student(db.Document):
    sid = db.IntField(unique=True)
    full_name = db.StringField(max_length=50)
    year_of_birth = db.IntField()
    university = db.StringField(max_length=60)
    major = db.StringField(max_length=60)