from flask import jsonify, request

from intern.model import Intern
from university.model import University


def interns():
    pipeline = [{
        "$lookup": {
            "from": "university",
            "localField": "university",
            "foreignField": "_id",
            "as": "university",
            "pipeline": [
                {
                    "$unset": ["_id"]
                }
            ]
        }},
        {
            "$unset": ["_id"]
        }
    ]
    interns_with_university = [intern for intern in Intern.objects.aggregate(pipeline)]

    for intern in interns_with_university:
        intern['university'] = intern['university'][0]['name']

    return jsonify({
        'interns': interns_with_university
    })


def interns_count():
    return str(Intern.objects.count())


def interns_by_university():
    university = University.objects(name=request.args.get('university')).first()
    if university is not None:
        university_id = university.to_mongo().to_dict()['_id']
        intern_count = Intern.objects(university=university_id).count()
        return str(intern_count)
    else:
        return "0"


def interns_by_year():
    return str(Intern.objects(year_of_birth=request.args.get('year_of_birth')).count())


def interns_by_gender():
    return str(Intern.objects(gender=request.args.get('gender')).count())
