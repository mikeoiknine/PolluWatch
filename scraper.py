from bs4 import BeautifulSoup
import requests


url = 'https://air-quality.com/place/canada/montreal/4ff1d451?lang=en&standard=aqi_us'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

vals = soup.find('div', {'class':'pollutants'}).get_text().replace('m³', 'm³ ')
AQI = soup.find('div', {'class':'indexValue'}).get_text()

#vals = 'PM2.5μg/m³ 7O3μg/m³ 62NO2μg/m³ 11COμg/m³ 284SO2μg/m³ 0'
pm_index = vals.index('O3')
pm = vals[:pm_index]
print("PM: ", pm)

o3_index = vals.index('NO2')
O3 = vals[pm_index:o3_index]
print("O3: ", O3)

no2_index = vals.index('CO')
NO2 = vals[o3_index:no2_index]
print("NO2: ", NO2)

co_index = vals.index('SO2')
CO = vals[no2_index:co_index]
print("CO: ", CO)

so2_index = vals.index('SO2')
SO2 = vals[co_index:]
print("SO2: ", SO2)

print("AQI: ", AQI)
