from flask import jsonify

from lecture.model import Lecture


def lectures():
    pipeline = [
        {
            "$lookup": {
                "from": "mentor",
                "localField": "mentors",
                "foreignField": "_id",
                "as": "mentors",
                "pipeline": [
                    {
                        "$unset": ["_id"]
                    }
                ]
            }
        },
        {
            "$lookup": {
                "from": "participating",
                "localField": "participatings",
                "foreignField": "_id",
                "as": "participatings",
                "pipeline": [
                    {
                        "$unset": ["_id", "intern"]
                    }
                ]
            }
        },
        {
            "$unset": ["_id"]
        }
    ]
    lectures_with_mentors = [lecture for lecture in Lecture.objects.aggregate(pipeline)]

    for lecture in lectures_with_mentors:
        mentors = []
        for mentor in lecture['mentors']:
            mentors.append(mentor['name'])
        lecture['mentors'] = mentors

        participatings = []
        for participating in lecture['participatings']:
            participatings.append(participating['status'])
        lecture['participatings'] = participatings

    return jsonify({
        'lectures': lectures_with_mentors
    })


def lectures_count():
    return str(Lecture.objects.count())
