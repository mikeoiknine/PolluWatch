import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .database import db_session


# Create and configure app
def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'polluwatch@35.184.135.100/polluwatch-db1'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'dev'

    # load the instance of config if it exists
    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    # Ensure the instance of the folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import data
    app.register_blueprint(data.bp)

    @app.route('/')
    def hello():
        return "Welcome to the server"

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db_session.remove()

    return app

