from flask import Flask
from flask_cors import CORS

import intern.controller
import lecture.controller
import mentor.controller
import practice.controller
import university.controller

app = Flask(__name__)
CORS(app)

app.add_url_rule('/interns', view_func=intern.controller.interns)
app.add_url_rule('/interns/count', view_func=intern.controller.interns_count)
app.add_url_rule('/interns/by_university', view_func=intern.controller.interns_by_university)
app.add_url_rule('/interns/by_year', view_func=intern.controller.interns_by_year)
app.add_url_rule('/interns/by_gender', view_func=intern.controller.interns_by_gender)

app.add_url_rule('/lectures', view_func=lecture.controller.lectures)
app.add_url_rule('/lectures/count', view_func=lecture.controller.lectures_count)

app.add_url_rule('/mentors/count', view_func=mentor.controller.mentors_count)

app.add_url_rule('/practices', view_func=practice.controller.practices)
app.add_url_rule('/practices/count', view_func=practice.controller.practices_count)

app.add_url_rule('/universities', view_func=university.controller.universities)


@app.before_first_request
def init_db():
    from common.controller import init
    init()


if __name__ == '__main__':
    app.run()
