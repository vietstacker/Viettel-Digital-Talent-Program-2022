from flask import Response, request, jsonify
from database.models import Student
from flask_restful import Api, Resource, reqparse

# Define parser and request args
parser = reqparse.RequestParser()
parser.add_argument('sid', type=int)
parser.add_argument('full_name', type=str)
parser.add_argument('year_of_birth', type=int)
parser.add_argument('university', type=str)
parser.add_argument('major', type=str)


class StudentsApi(Resource):
    def get(self):
        students = Student.objects().to_json()

        return Response(students, mimetype="application/json", status=200)

    def post(self):
        args = parser.parse_args()

        sid = args['sid']
        full_name = args['full_name']
        year_of_birth = args['year_of_birth']
        university = args['university']
        major = args['major']

        return jsonify(sid=sid, full_name=full_name, year_of_birth=year_of_birth, university=university, major=major)
        
class StudentApi(Resource):
    def put(self, id):
        body = request.get_json()
        Student.objects.get(id=id).update(**body)
        return 'Updated!', 200
    
    def delete(self, id):
        students = Student.objects.get(id=id).delete()
        return 'Deleted success!', 200

    def get(self, id):
        students = Student.objects.get(id=id).to_json()
        return Response(students, mimetype="application/json", status=200)        