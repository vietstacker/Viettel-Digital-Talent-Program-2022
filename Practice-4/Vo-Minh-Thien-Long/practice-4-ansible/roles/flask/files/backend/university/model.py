from mongoengine import connect, Document, StringField

connect('vdt2022', host='mongodb://54.90.221.86')


class University(Document):
    name = StringField(required=True, unique=True)
