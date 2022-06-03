from mongoengine import connect, Document, StringField

connect('vdt2022')


class University(Document):
    name = StringField(required=True, unique=True)
