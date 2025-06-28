import pymongo
import pytz

import os
from os.path import join, dirname
from dotenv import load_dotenv
from random import choice

IST = pytz.timezone('Asia/Kolkata')

headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0',
    'Connection': 'keep-alive',
    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
}
base_url = 'https://www.nseindia.com/api/option-chain-equities?symbol='

proxies_list = [
    '23.231.34.95:12345:104server:Devender',
'23.95.224.70:12345:104server:Devender',
'23.94.52.173:12345:104server:Devender',
'23.95.219.93:12345:104server:Devender',
'23.95.81.62:12345:104server:Devender',
'23.95.237.114:12345:104server:Devender',
'23.95.81.182:12345:104server:Devender',
'23.95.224.205:12345:104server:Devender',
'23.81.229.126:12345:104server:Devender',
'23.95.239.46:12345:104server:Devender',
'23.95.237.244:12345:104server:Devender',
'23.95.81.176:12345:104server:Devender',
'23.94.32.58:12345:104server:Devender',
'23.95.81.98:12345:104server:Devender',
'23.231.34.184:12345:104server:Devender',
'23.95.97.248:12345:104server:Devender',
'23.95.237.46:12345:104server:Devender',
'23.95.237.50:12345:104server:Devender',
'23.95.224.97:12345:104server:Devender',
'23.95.224.66:12345:104server:Devender',
'23.95.81.82:12345:104server:Devender',
'23.95.224.19:12345:104server:Devender',
'23.95.219.224:12345:104server:Devender',
'23.95.224.95:12345:104server:Devender',
'23.95.219.3:12345:104server:Devender',
'23.95.81.103:12345:104server:Devender',
'23.95.204.162:12345:104server:Devender',
'23.95.237.170:12345:104server:Devender',
'23.95.237.150:12345:104server:Devender',
'23.95.204.153:12345:104server:Devender',
'23.250.43.190:12345:104server:Devender',
'23.231.34.185:12345:104server:Devender',
'23.95.204.195:12345:104server:Devender',
'23.94.77.53:12345:104server:Devender',
'23.95.237.184:12345:104server:Devender',
'23.95.219.71:12345:104server:Devender',
'23.95.219.211:12345:104server:Devender',
'23.95.97.217:12345:104server:Devender',
'23.95.81.56:12345:104server:Devender',
'23.94.32.228:12345:104server:Devender',
'23.95.224.238:12345:104server:Devender',
'23.95.237.110:12345:104server:Devender',
'23.95.204.11:12345:104server:Devender',
'23.95.224.225:12345:104server:Devender',
'23.95.237.54:12345:104server:Devender',
'23.231.34.69:12345:104server:Devender',
'23.94.32.139:12345:104server:Devender',
'23.95.204.184:12345:104server:Devender',
'23.95.224.113:12345:104server:Devender',
'23.95.81.163:12345:104server:Devender',
'23.95.204.6:12345:104server:Devender',
'23.95.81.187:12345:104server:Devender',
'23.94.32.6:12345:104server:Devender',
'23.95.219.33:12345:104server:Devender',
'23.95.237.154:12345:104server:Devender',
'23.95.219.195:12345:104server:Devender',
'23.95.237.32:12345:104server:Devender',
'23.94.77.25:12345:104server:Devender',
'23.95.237.214:12345:104server:Devender',
'23.95.219.214:12345:104server:Devender',
'23.95.237.177:12345:104server:Devender',
'23.95.237.49:12345:104server:Devender',
'23.95.224.101:12345:104server:Devender',
'23.250.43.171:12345:104server:Devender',
'23.95.81.132:12345:104server:Devender',
'23.95.237.250:12345:104server:Devender',
'23.95.224.215:12345:104server:Devender',
'23.95.224.123:12345:104server:Devender',
'23.95.224.16:12345:104server:Devender',
'23.94.32.185:12345:104server:Devender',
'23.231.34.228:12345:104server:Devender',
'23.95.81.159:12345:104server:Devender',
'23.95.219.76:12345:104server:Devender',
'23.95.224.119:12345:104server:Devender',
'23.250.43.175:12345:104server:Devender',
'23.95.219.68:12345:104server:Devender',
'23.95.204.141:12345:104server:Devender',
'23.95.114.136:12345:104server:Devender',
'23.231.34.91:12345:104server:Devender',
'23.95.237.129:12345:104server:Devender',
'23.95.224.243:12345:104server:Devender',
'23.95.224.91:12345:104server:Devender',
'191.102.182.74:12345:104server:Devender',
'191.102.182.114:12345:104server:Devender',
'191.102.182.137:12345:104server:Devender',
'191.102.182.200:12345:104server:Devender',


]

dotenv_path = join(dirname(__file__), '../.env')
load_dotenv(dotenv_path)

client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client.piplus

def get_proxy():
    proxy = choice(proxies_list)
    split_proxy = proxy.split(':')
    formatted_proxy = '{}:{}@{}:12345'.format(split_proxy[2], split_proxy[-1], split_proxy[0])
    return {
        'http': 'http://' + formatted_proxy,
        'https': 'http://' +  formatted_proxy
    }
