import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy


# Create and configure app
def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping (
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

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

    @app.route('/hello')
    def hello():
        return "Hello!"

    return app
