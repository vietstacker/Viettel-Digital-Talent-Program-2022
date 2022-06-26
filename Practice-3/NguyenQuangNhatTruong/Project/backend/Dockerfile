FROM python:3.9
WORKDIR /code
COPY requirements.txt requirements.txt 

RUN pip install --upgrade pip \
    pip install --no-cache-dir -r requirements.txt
COPY app.py .
ENV FLASK_APP=app
ENV FLASK_RUN_HOST=0.0.0.0 
EXPOSE 5000
CMD ["flask","run"]