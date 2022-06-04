FROM python:3.9-slim

WORKDIR /be

COPY requirements.txt requirements.txt

RUN pip install --upgrade pip \
    pip install -r requirements.txt --no-cache-dir

COPY . .
