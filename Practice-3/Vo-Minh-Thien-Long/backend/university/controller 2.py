from flask import jsonify

from university.model import University


def universities():
    return jsonify({
        'universities': [
            university.to_mongo().to_dict() for university in University.objects.exclude("id").all()
        ]
    })
