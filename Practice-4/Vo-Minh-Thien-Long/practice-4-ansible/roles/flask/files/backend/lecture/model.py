from mongoengine import connect, Document, StringField, ReferenceField, IntField, EnumField, \
    DateTimeField, ListField

from common.model import Status
from intern.model import Intern
from mentor.model import Mentor

connect('vdt2022', host='mongodb://54.90.221.86')


class Participating(Document):
    intern = ReferenceField(Intern, required=True)
    status = EnumField(Status, default=Status.ON_TIME)


class Lecture(Document):
    order = IntField(required=True, unique=True)
    name = StringField(required=True)
    started_at = DateTimeField(required=True)
    mentors = ListField(ReferenceField(Mentor), default=[])
    participatings = ListField(ReferenceField(Participating), default=[])
    image_path = StringField(required=True)
