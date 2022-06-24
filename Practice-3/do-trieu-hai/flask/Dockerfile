FROM python:3.9

WORKDIR /src
COPY ./requirement.txt /src/requirements.txt
RUN pip install -r requirement.txt --no-cache-dir

EXPOSE 5000
CMD ["python","0.0.0.0:5000","./server.py"]