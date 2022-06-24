from enum import Enum

from mongoengine import connect, Document, StringField, ReferenceField, IntField, EnumField

from university.model import University

connect('vdt2022',
        host="mongodb",
        port=27017,
        username="practice3",
        password="practice3",
        authentication_source='admin')


class Gender(Enum):
    MALE = 'nam'
    FEMALE = 'nữ'


class Intern(Document):
    order = IntField(required=True, unique=True)
    name = StringField(required=True, unique=True)
    year_of_birth = IntField(max_value=2022, required=True)
    university = ReferenceField(University, required=True)
    major = StringField(required=True)
    gender = EnumField(Gender, default=Gender.MALE)
