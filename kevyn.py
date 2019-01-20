from flask import (
    Blueprint, request, redirect, render_template, url_for, current_app, Response
)

bp = Blueprint('/kevyn', __name__, url_prefix='/kevyn')

@bp.route('/', methods=['GET'])
def get_face():
    return render_template('index.html')
