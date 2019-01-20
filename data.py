from flask import (
    Blueprint, request, redirect, url_for, current_app, Response
)
import json
from .database import db_session
from .models import Sensor, PublicMessage
from bs4 import BeautifulSoup
import requests


bp = Blueprint('data', __name__, url_prefix='/data')

@bp.route('/update', methods=['POST'])
def update_data():
    response = request.get_json()

    print(response)

    # Validate json data
    if response is None:
        return "Invalid JSON data"

    sensor = Sensor(response)

    # Update db
    db_session.add(sensor)
    db_session.commit()
    print('Record was added successfully')

    return str(response) + "\n"

@bp.route('/sensors', methods=['GET'])
def get_sensor_data():
    return Response(json.dumps([{
        'temperature'       : query.temperature,
        'pressure'          : query.pressure,
        'humidity'          : query.humidity,
        'gas_resistance'    : query.gas_resistance,
        'longitude'         : query.longitude,
        'latitude'          : query.latitude,
        'timestamp'         : query.timestamp}
        for query in Sensor.query.all()]), mimetype='application/json')

@bp.route('/stats', methods=['GET'])
def get_air_quality_stats():
    url = 'https://air-quality.com/place/canada/montreal/4ff1d451?lang=en&standard=aqi_us'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    vals = soup.find('div', {'class':'pollutants'}).get_text().replace('m³', 'm³ ')
    AQI = soup.find('div', {'class':'indexValue'}).get_text()

    stats = {}

    pm_index = vals.index('O3')
    stats['PM2.5'] = vals[:pm_index].split()[1]

    o3_index = vals.index('NO2')
    stats['O3'] = vals[pm_index:o3_index].split()[1]

    no2_index = vals.index('CO')
    stats['NO2'] = vals[o3_index:no2_index].split()[1]

    co_index = vals.index('SO2')
    stats['CO'] = vals[no2_index:co_index].split()[1]

    so2_index = vals.index('SO2')
    stats['SO2'] = vals[co_index:].split()[1]

    stats['AQI'] = AQI

    return Response(json.dumps(stats), mimetype='application/json')

@bp.route('/comment', methods=['POST', 'GET'])
def comment():
    if request.method == 'POST':
        response = request.get_json()

        print(response)

        if response is None:
            return "Invalid JSON data"

        msg = PublicMessage(response)

        db_session.add(msg)
        db_session.commit()
        print('Message was recorded successfully')

        return str(response) + "\n"

    return Response(json.dumps([{
        'author'    : query.author,
        'message'   : query.message,
        'picture'   : query.picture,
        'longitude' : query.longitude,
        'latitude'  : query.latitude,
        'timestamp' : query.timestamp}
        for query in PublicMessage.query.all()]), mimetype='application/json')
