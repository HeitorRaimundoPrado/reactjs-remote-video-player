from __init__ import create_app


app = create_app(False)

if __name__ == '__main__':
    app.run()
