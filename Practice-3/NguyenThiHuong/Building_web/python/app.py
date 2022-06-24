import config
from flask import jsonify, render_template, request, Flask
from flask_mongoengine import MongoEngine
app = Flask(__name__)
app.config['MONGODB_SETTINGS'] = config.get_config()
db = MongoEngine()
db.init_app(app)


class Attendee(db.Document):
    number = db.IntField()
    name = db.StringField()
    yob = db.StringField()
    major = db.StringField()
    university = db.StringField()


@app.route('/all', methods=['GET'])
def all():
    attendees= list(Attendee.objects.all())
    attendees.sort(key=lambda x: x.number)
    return render_template('present.html', attendees=attendees)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
