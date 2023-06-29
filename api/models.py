from __init__ import db



class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000))

class Playlist(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String)
    files = db.relationship('File', secondary='files_playlists', backref=db.backref('files', lazy='dynamic'))

class File(db.Model):
    id = db.Column(db.Integer, autoincrement=True, unique=True, primary_key=True)
    file = db.Column(db.String(100), unique=True)
    name = db.Column(db.String(100))
    artist = db.Column(db.String(100))
    playlists = db.relationship('Playlist',
                                # primaryjoin=(playlists_files.c.file_id == id),
                                # secondaryjoin=(playlists_files.c.playlist_id == Playlist.id),
                                secondary='playlists_files', backref=db.backref('playlists', lazy='dynamic'))

playlists_files = db.Table("playlists_files",
                           db.Column('playlist_id', db.Integer, db.ForeignKey('playlist.id')),
                           db.Column('file_id', db.Integer, db.ForeignKey('file.id')))

files_playlists = db.Table('files_playlists',
                           db.Column('file_id', db.Integer, db.ForeignKey('file.id')),
                           db.Column('playlist_id', db.Integer, db.ForeignKey('playlist.id')))
