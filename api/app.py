from __init__ import create_app


DEPLOYMENT = False

app = create_app(DEPLOYMENT)

if __name__ == '__main__':
    app.run(debug=bool(~DEPLOYMENT))
