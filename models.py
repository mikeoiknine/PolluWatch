import json
from sqlalchemy import Column, Integer, Float, String
from .database import Base


class Sensor(Base):
    __tablename__   = 'pollution-stats1'
    id              = Column('sensor_id', Integer, primary_key = True)
    temperature     = Column(Float)
    pressure        = Column(Float)
    humidity        = Column(Float)
    gas_resistance  = Column(Float)
    longitude       = Column(Float)
    latitude        = Column(Float)
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


class PublicMessage(Base):
    __tablename__   = 'public-message1'
    id              = Column('sensor_id', Integer, primary_key = True)
    author          = Column(String(64))
    message         = Column(String(256))
    picture         = Column(String(128))
    longitude       = Column(Float)
    latitude        = Column(Float)
    timestamp       = Column(Integer)

    def __init__(self, msg_item):
        self.author     = msg_item['author']
        self.message    = msg_item['message']
        self.picture    = msg_item['picture']
        self.longitude  = msg_item['longitude']
        self.latitude   = msg_item['latitude']
        self.timestamp  = msg_item['timestamp']


