from flask import jsonify
from DataAccessObjects.statisticsDAO import statisticsDAO

class statisticsHandler:

    def __init__(self):
        self.dao = statisticsDAO()
    
    def totalNumberOfTransactions(self):
        result = self.dao.totalNumberOfTransactions()

        return jsonify({'status': 'success'}, result), 200

    def top10ItemSellers(self):
        result = self.dao.top10ItemSellers()

        return jsonify({'status': 'success'}, result), 200

    def customerDistributionByCity(self):
        result = self.dao.customerDistributionByCity()

        return jsonify({'status': 'success'}, result), 200

    def customerDistributionByCountry(self):
        result = self.dao.customerDistributionByCountry()

        return jsonify({'status': 'success'}, result), 200
        
    def getAllPeople(self):
        result = self.dao.getAllPeople()

        return jsonify({'status': 'success'}, result), 200
    
    def storeMostTransactions(self):
        result = self.dao.storeMostTransactions()

        return jsonify({'status': 'success'}, result), 200
    
    def mostUsedDevice(self):
        result = self.dao.mostUsedDevice()

        return jsonify({'status': 'success'}, result), 200
    
    def highestSpendingCustomer(self):
        result = self.dao.highestSpendingCustomer()

        return jsonify({'status': 'success'}, result), 200
    
    def getCustomerCount(self):
        result = self.dao.getCustomerCount()

        return jsonify({'status': 'success'}, result), 200
    
    def countryMostUsers(self):
        result = self.dao.countryMostUsers()

        return jsonify({'status': 'success'}, result), 200
    
    def cityMostUsers(self):
        result = self.dao.cityMostUsers()

        return jsonify({'status': 'success'}, result), 200
    
    def averageTransaction(self):
        result = self.dao.averageTransaction()

        return jsonify({'status': 'success'}, result), 200
    
    def storeLeastTransactions(self):
        result = self.dao.storeLeastTransactions()

        return jsonify({'status': 'success'}, result), 200
    
    def totalTransfers(self):
        result = self.dao.totalTransfers()

        return jsonify({'status': 'success'}, result), 200
    
    def receivedMostTransfers(self):
        result = self.dao.receivedMostTransfers()

        return jsonify({'status': 'success'}, result), 200
    
    def sentMostTransfers(self):
        result = self.dao.sentMostTransfers()

        return jsonify({'status': 'success'}, result), 200

    def totalPromotions(self):
        result = self.dao.totalPromotions()

        return jsonify({'status': 'success'}, result), 200

    def totalRespondedPromotions(self):
        result = self.dao.totalRespondedPromotions()

        return jsonify({'status': 'success'}, result), 200
    
    def totalNotRespondedPromotions(self):
        result = self.dao.totalNotRespondedPromotions()

        return jsonify({'status': 'success'}, result), 200
    
    def topCompaniesPromotionsCount(self):
        result = self.dao.topCompaniesPromotionsCount()

        return jsonify({'status': 'success'}, result), 200
    
    def top10HighestTransfers(self):
        result = self.dao.top10HighestTransfers()

        return jsonify({'status': 'success'}, result), 200
    
    def transfersByDate(self):
        result = self.dao.transfersByDate()

        return jsonify({'status': 'success'}, result), 200
    
    def storeTransactionCounts(self):
        result = self.dao.storeTransactionCounts()

        return jsonify({'status': 'success'}, result), 200