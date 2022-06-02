from mongoengine import connect, Document, StringField

connect('vdt2022',
        host="mongodb",
        port=27017,
        username="practice3",
        password="practice3",
        authentication_source='admin')


class Mentor(Document):
    name = StringField(required=True, unique=True)
