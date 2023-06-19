from __init__ import create_app


DEPLOYMENT = False

app = create_app(DEPLOYMENT)

import music
import index
import youtube
import auth
import video
import upload
app.register_blueprint(index.bp)
app.register_blueprint(music.bp)
app.register_blueprint(youtube.bp)
app.register_blueprint(auth.bp)
app.register_blueprint(video.bp)
app.register_blueprint(upload.bp)

if __name__ == '__main__':
    app.run(threaded=True, debug=bool(~DEPLOYMENT))
