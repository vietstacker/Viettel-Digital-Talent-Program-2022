from flask import Flask, jsonify, render_template     
import pymongo                 
from pymongo import MongoClient       

app = Flask(__name__)        

def get_db():    
    client = MongoClient(host='test_mongodb',  
                         port=27017,   
                         user='root',   
                         password='pass',   
                         authSource='admin')      
    db = client.flaskdb  
     return db  
      
@app.route('/')     
def get_stored_student():   
    db=""   
    try:  
        db = get_db()   
        _student = db.student.find()    
        return render_template('index.html', todos= _student)   
    except:  
        pass  
    finally:  
        if type(db)==MongoClient:   
            db.close()       

if __name__=='__main__':   
    app.run(host='0.0.0.0', port=5000)  