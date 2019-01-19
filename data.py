# import DB
from flask import (
    Blueprint, request
)

bp = Blueprint('data', __name__, url_prefix='/data')

@bp.route('/update', methods=['POST'])
def update_data():
    json_req = request.get_json()
    # Validate json data

    if json_req is None:
        return "Invalid JSON data"

    # print to console for debugging
    print(json_req)

    # Update db


    return str(json_req) + "\n"
