FROM python:3.9

WORKDIR /app

COPY ./requirements.txt .

RUN pip3 install --no-cache-dir -r ./requirements.txt

COPY ./app.py .

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]


