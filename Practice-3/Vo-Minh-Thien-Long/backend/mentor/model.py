from mongoengine import connect, Document, StringField

connect('vdt2022')


class Mentor(Document):
    name = StringField(required=True, unique=True)
