import sys
import requests
from datetime import datetime

from constants import IST, headers, base_url, db, get_proxy

optionStockCol = db['option stocks']
optionDataCol = db['option datas']
option_stocks = optionStockCol.find().sort('symbol')

date = (datetime.now()).replace(hour=0, minute=0, second=0, microsecond=0) # get today's date GMT
createdAt = datetime.now(IST)

print(date)

# Check if there is a argument from js
# if yes set date as last data date
try:
    if sys.argv[1]:
        option_last_date = optionDataCol.find({}, { '_id': 0, 'date': -1 }).sort('date -_id').limit(1)
        date = option_last_date[0]['date']
except IndexError:
    pass

s = requests.Session()
s.proxies.update(get_proxy())
try:
    s.get('https://www.nseindia.com/', headers=headers, timeout=10)
except requests.exceptions.Timeout or requests.exceptions.ReadTimeout:
    s.proxies.update(get_proxy())
    s.get('https://www.nseindia.com/', headers=headers, timeout=10)


option_datas = []

for stock in option_stocks:
    print(stock['symbol'])
    option_expiry_dates = []
    option_data = []
    resp = s.get((base_url + (stock['symbol']).replace('&', '%26')), headers=headers)
    if resp.ok:
        resp_data = resp.json()
        if len(resp_data.get('records', {}).get('data', [])) > 0:
            for d in resp_data['records']['data']:
                if d.get('CE', {}).get('openInterest', 0) > 0 or d.get('PE', {}).get('openInterest', 0) > 0:
                    option_records = {}
                    if d.get('CE', {}).get('openInterest', 0) > 0:
                        option_records = {
                            'CE': {
                                'open_interest': d['CE']['openInterest'],
                                'change_in_OI': d['CE']['changeinOpenInterest'],
                                'volume': d['CE']['totalTradedVolume'],
                                'IV': d['CE']['impliedVolatility'],
                                'last_price': d['CE']['lastPrice'],
                                'change': d['CE']['change']
                            }
                        }
                    if d.get('PE', {}).get('openInterest', 0) > 0:
                        option_records = {
                            **option_records,
                            'PE': {
                                'open_interest': d['PE']['openInterest'],
                                'change_in_OI': d['PE']['changeinOpenInterest'],
                                'volume': d['PE']['totalTradedVolume'],
                                'IV': d['PE']['impliedVolatility'],
                                'last_price': d['PE']['lastPrice'],
                                'change': d['PE']['change']
                            }
                        }
                    try:
                        index = option_expiry_dates.index(d['expiryDate'])
                        option_data[index]['data'].append({
                            'strike_price': d['strikePrice'],
                            **option_records
                        })
                    except ValueError:
                        option_expiry_dates.append(d['expiryDate'])
                        option_data.append({
                            'date': date,
                            'expiry_date': datetime.strptime(d['expiryDate'], "%d-%b-%Y"),
                            'underlying_value': resp_data['records']['underlyingValue'],
                            'stock': stock['_id'],
                            'data': [{
                                'strike_price': d['strikePrice'],
                                **option_records
                            }],
                            'createdAt': createdAt
                        })
            option_datas = option_datas + option_data
    # break

if(len(option_datas) > 0):
    optionDataCol.delete_many({'date': date}) # delete previous today stocks
    optionDataCol.insert_many(option_datas)
# print(option_datas)
print("Done")
sys.stdout.flush()


