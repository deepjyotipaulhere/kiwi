FROM python:3-onbuild  

# Coping source in current directory into the image
# python:3-onbuild expects the source in /usr/src/app
WORKDIR /app
COPY requirements.txt requirements.txt
COPY . .
RUN pip install -r requirements.txt
EXPOSE 5000

# Commands in a list
CMD ["python", "service.py"]