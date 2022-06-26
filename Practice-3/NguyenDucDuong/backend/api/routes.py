from .student import StudentsApi, StudentApi

def initialize_routes(api):
    api.add_resource(StudentsApi, '/api/students')
    api.add_resource(StudentApi, '/api/students/<id>')