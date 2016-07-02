from pymongo import MongoClient

client = MongoClient('128.199.138.180',27017)
db = client.rhime_prod
articles = db.articles

