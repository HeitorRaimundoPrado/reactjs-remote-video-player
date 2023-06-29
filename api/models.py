from __init__ import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000))

class File(db.Model):
    file = db.Column(db.String(100), unique=True, primary_key=True)
    name = db.Column(db.String(100))
    artist = db.Column(db.String(100))

