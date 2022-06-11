from flask import jsonify

from practice.model import Practice


def practices():
    pipeline = [
        {
            "$lookup": {
                "from": "submission",
                "localField": "submissions",
                "foreignField": "_id",
                "as": "submissions",
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
    return jsonify({
        'practices': [
            practice for practice in Practice.objects.aggregate(pipeline)
        ]
    })


def practices_count():
    return str(Practice.objects.count())