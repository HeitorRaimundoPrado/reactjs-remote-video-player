# 1 
FROM python:3.8.10

# 2
RUN pip install -r requirements.txt

# 3
WORKDIR /api

# 4
ENV PORT 8080

# 5
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 "app:create_app"
