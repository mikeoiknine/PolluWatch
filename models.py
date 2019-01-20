import json
from sqlalchemy import Column, Integer
from .database import Base


class Sensor(Base):
    __tablename__   = 'pollution-stats2'
    id              = Column('sensor_id', Integer, primary_key = True)
    temperature     = Column(Integer)
    pressure        = Column(Integer)
    humidity        = Column(Integer)
    gas_resistance  = Column(Integer)
    longitude       = Column(Integer)
    latitude        = Column(Integer)
    timestamp       = Column(Integer)

    def __init__(self, response):
        self.temperature    = response['temperature']
        self.pressure       = response['pressure']
        self.humidity       = response['humidity']
        self.gas_resistance = response['gas_resistance']
        self.longitude      = response['longitude']
        self.latitude       = response['latitude']
        self.timestamp      = response['timestamp']

    def __repr__(self):
        return '<%d Temp: %d\n Pressure: %d\n Humidity: %d\n Gas Resistance: %d\n Longitude: %d\n Latitude: %d\n TimeStamp: %d\n>' % (self.id), (self.temperature), (self.pressure), (self.humidity), (self.gas_resistance), (self.longitude), (self.latitude), (self.timestamp)
