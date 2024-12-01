from flask import Blueprint
from Handlers.statistics import statisticsHandler
from DDoSMitigator import DDoSMitigator  

statistics_bp = Blueprint('statistics_bp', __name__)
functions = statisticsHandler()
ddos_mitigator = DDoSMitigator()


# vanilla routes with no DDOS protection applied, can be used for testing. Uncoment as needed. Make sure to comment out the routes with DDOS protection applied.

statistics_bp.add_url_rule('/DummyWebsite/statistics/customersByCity', view_func=functions.customerDistributionByCity, methods=['GET'])
statistics_bp.add_url_rule('/DummyWebsite/statistics/customersByCountry', view_func=functions.customerDistributionByCountry, methods=['GET'])
statistics_bp.add_url_rule('/DummyWebsite/statistics/totalNumTransactions', view_func=functions.totalNumberOfTransactions, methods=['GET'])
statistics_bp.add_url_rule('/DummyWebsite/statistics/top10ItemSellers', view_func=functions.top10ItemSellers, methods=['GET'])
statistics_bp.add_url_rule('/DummyWebsite/statistics/getAllPeople', view_func=functions.getAllPeople, methods=['GET'])
statistics_bp.add_url_rule('/DummyWebsite/statistics/storeMostTransactions', view_func=functions.storeMostTransactions, methods=['GET'])
statistics_bp.add_url_rule('/DummyWebsite/statistics/mostUsedDevice', view_func=functions.mostUsedDevice, methods=['GET'])
statistics_bp.add_url_rule('/DummyWebsite/statistics/highestSpendingCustomer', view_func=functions.highestSpendingCustomer, methods=['GET'])
statistics_bp.add_url_rule('/DummyWebsite/statistics/customerCount', view_func=functions.getCustomerCount, methods=['GET'])
statistics_bp.add_url_rule('/DummyWebsite/statistics/countryMostUsers', view_func=functions.countryMostUsers, methods=['GET'])
statistics_bp.add_url_rule('/DummyWebsite/statistics/cityMostUsers', view_func=functions.cityMostUsers, methods=['GET'])
statistics_bp.add_url_rule('/DummyWebsite/statistics/avgTransaction', view_func=functions.averageTransaction, methods=['GET'])
statistics_bp.add_url_rule('/DummyWebsite/statistics/storeLeastTransactions', view_func=functions.storeLeastTransactions, methods=['GET'])
statistics_bp.add_url_rule('/DummyWebsite/statistics/totalTransfers', view_func=functions.totalTransfers, methods=['GET'])
statistics_bp.add_url_rule('/DummyWebsite/statistics/receivedMostTransfers', view_func=functions.receivedMostTransfers, methods=['GET'])
statistics_bp.add_url_rule('/DummyWebsite/statistics/sentMostTransfers', view_func=functions.sentMostTransfers, methods=['GET'])
statistics_bp.add_url_rule('/DummyWebsite/statistics/totalPromotions', view_func=functions.totalPromotions, methods=['GET'])
statistics_bp.add_url_rule('/DummyWebsite/statistics/totalRespondedPromotions', view_func=functions.totalRespondedPromotions, methods=['GET'])
statistics_bp.add_url_rule('/DummyWebsite/statistics/totalNotRespondedPromotions', view_func=functions.totalNotRespondedPromotions, methods=['GET'])
statistics_bp.add_url_rule('/DummyWebsite/statistics/topCompaniesPromotionsCount', view_func=functions.topCompaniesPromotionsCount, methods=['GET'])
statistics_bp.add_url_rule('/DummyWebsite/statistics/largestTransfers', view_func=functions.top10HighestTransfers, methods=['GET'])
statistics_bp.add_url_rule('/DummyWebsite/statistics/transfersByDate', view_func=functions.transfersByDate, methods=['GET'])
statistics_bp.add_url_rule('/DummyWebsite/statistics/storeTransactionCounts', view_func=functions.storeTransactionCounts, methods=['GET'])

