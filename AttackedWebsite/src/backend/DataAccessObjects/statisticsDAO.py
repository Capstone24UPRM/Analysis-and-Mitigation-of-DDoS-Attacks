from config.dbConfig import getDBConnection

class statisticsDAO:

    def totalNumberOfTransactions(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT COUNT(*) AS total_transactions
        FROM Transactions;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        totalTransactions = [{'total_transactions': row[0]} for row in result]

        return totalTransactions

    def top10ItemSellers(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT item_name, SUM(quantity) AS total_quantity_sold
        FROM TransactionItem
        GROUP BY item_name
        ORDER BY total_quantity_sold DESC
        LIMIT 10;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        topItems = [{'item_name': row[0], 'total_quantity_sold': row[1]} for row in result]

        return topItems

    def customerDistributionByCity(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT city, COUNT(*) AS customer_count
        FROM People
        GROUP BY city
        ORDER BY customer_count DESC;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        customersByCity = [{'city': row[0], 'customer_count': row[1]} for row in result]

        return customersByCity

    def customerDistributionByCountry(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT country, COUNT(*) AS customer_count
        FROM People
        GROUP BY country
        ORDER BY customer_count DESC;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        customersByCountry = [{'country': row[0], 'customer_count': row[1]} for row in result]

        return customersByCountry
    
    def getAllPeople(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT *
        FROM People
        ORDER BY personID;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        person = [{'personid': row[0],
                    'first_name': row[1],
                    'last_name': row[2],
                    'telephone': row[3],
                    'email': row[4],
                    'city': row[5],
                    'country': row[6],
                    'devices': row[7]} for row in result]

        return person
    
    def storeMostTransactions(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT store, COUNT(*) AS num_transactions
        FROM Transactions
        GROUP BY store
        ORDER BY num_transactions DESC
        LIMIT 1;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        store = [{'store': row[0],
                    'num_transactions': row[1]} for row in result]

        return store
    
    def mostUsedDevice(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT device, COUNT(*) AS num_users
        FROM People
        CROSS JOIN LATERAL UNNEST(devices) AS device
        GROUP BY device
        ORDER BY num_users DESC
        LIMIT 1;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        device = [{'device': row[0],
                    'num_users': row[1]} for row in result]

        return device
    
    def highestSpendingCustomer(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT 
            p.personID, 
            p.first_name, 
            p.last_name, 
            SUM(ti.price_per_item * ti.quantity) AS total_spent
        FROM 
            People p
        JOIN 
            Transactions t ON p.telephone = t.telephone
        JOIN 
            TransactionItem ti ON t.TransactionID = ti.TransactionID
        GROUP BY 
            p.personID, 
            p.first_name, 
            p.last_name
        ORDER BY 
            total_spent DESC
        LIMIT 1;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        person = [{'personid': row[0],
                    'first_name': row[1],
                    'last_name': row[2],
                    'total_spent': row[3]} for row in result]

        return person
    
    def getCustomerCount(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT COUNT(*) AS num_people
        FROM People;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        numberOfPeople = [{'num_people': row[0]} for row in result]

        return numberOfPeople
    
    def countryMostUsers(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT 
            country, 
            COUNT(*) AS num_users
        FROM 
            People
        GROUP BY 
            country
        ORDER BY 
            num_users DESC
        LIMIT 1;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        country = [{'country': row[0], 'num_users': row[1]} for row in result]

        return country
    
    def cityMostUsers(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT 
            city, 
            COUNT(*) AS num_users
        FROM 
            People
        GROUP BY 
            city
        ORDER BY 
            num_users DESC
        LIMIT 1;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        country = [{'city': row[0], 'num_users': row[1]} for row in result]

        return country
    
    def cityMostUsers(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT 
            city, 
            COUNT(*) AS num_users
        FROM 
            People
        GROUP BY 
            city
        ORDER BY 
            num_users DESC
        LIMIT 1;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        country = [{'city': row[0], 'num_users': row[1]} for row in result]

        return country
    
    def averageTransaction(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT ROUND(AVG(transaction_total), 2) AS average_spent
        FROM (
            SELECT 
                t.TransactionID, 
                SUM(ti.price_per_item * ti.quantity) AS transaction_total
            FROM 
                Transactions t
            JOIN 
                TransactionItem ti ON t.TransactionID = ti.TransactionID
            GROUP BY 
                t.TransactionID
        ) sub;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        avg = [{'avg_transaction': row[0]} for row in result]

        return avg
    
    def storeLeastTransactions(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT
            store,
            COUNT(*) AS num_transactions
        FROM
            Transactions
        GROUP BY
            store
        ORDER BY
            num_transactions
        LIMIT 1;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        store = [{'store': row[0], 'num_transactions': row[1]} for row in result]

        return store
    
    def totalTransfers(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT COUNT(*) AS total_transfers
        FROM Transfers;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        totalTransfers = [{'total_transfers': row[0]} for row in result]

        return totalTransfers
    
    def receivedMostTransfers(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT 
            p.personID, 
            p.first_name, 
            p.last_name, 
            COUNT(t.TransferID) AS num_transfers_received
        FROM 
            People p
        JOIN 
            Transfers t ON p.personID = t.recipientID
        GROUP BY 
            p.personID, 
            p.first_name, 
            p.last_name
        ORDER BY 
            num_transfers_received DESC
        LIMIT 1;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        receivedMost = [{'personid': row[0],
                         'first_name': row[1],
                         'last_name': row[2],
                         'num_transfers_received': row[3]} for row in result]

        return receivedMost
    
    def sentMostTransfers(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT
            p.personID,
            p.first_name,
            p.last_name,
            COUNT(t.TransferID) AS num_transfers_sent
        FROM
            People p
        JOIN
            Transfers t ON p.personID = t.senderID
        GROUP BY
            p.personID,
            p.first_name,
            p.last_name
        ORDER BY
            num_transfers_sent DESC
        LIMIT 1;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        sentMost = [{'personid': row[0],
                         'first_name': row[1],
                         'last_name': row[2],
                         'num_transfers_received': row[3]} for row in result]

        return sentMost
    
    def totalPromotions(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT COUNT(*) AS total_promotions
        FROM Promotions;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        totalPromotions = [{'total_promotions': row[0]} for row in result]

        return totalPromotions
    
    def totalRespondedPromotions(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT COUNT(*) AS total_responded_promotions
        FROM Promotions
        WHERE responded = TRUE;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        total_responded_promotions = [{'total_responded_promotions': row[0]} for row in result]

        return total_responded_promotions
    
    def totalNotRespondedPromotions(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT COUNT(*) AS total_not_responded_promotions
        FROM Promotions
        WHERE responded = FALSE;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        total_not_responded_promotions = [{'total_not_responded_promotions': row[0]} for row in result]

        return total_not_responded_promotions
    
    # this is really products not companies.
    def topCompaniesPromotionsCount(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT 
            promotion_name, 
            COUNT(*) AS num_promotions
        FROM 
            Promotions
        GROUP BY 
            promotion_name
        ORDER BY 
            num_promotions DESC
        LIMIT 10;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        company = [{'promotion_name': row[0], 'num_promotions': row[1]} for row in result]

        return company
    
    def top10HighestTransfers(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT
            t.TransferID,
            sender.first_name AS sender_first_name,
            sender.last_name AS sender_last_name,
            recipient.first_name AS recipient_first_name,
            recipient.last_name AS recipient_last_name,
            t.amount,
            t.date
        FROM
            Transfers t
        JOIN
            People sender ON t.senderID = sender.personID
        JOIN
            People recipient ON t.recipientID = recipient.personID
        ORDER BY
            t.amount DESC
        LIMIT 10;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        largestTransfers = [{'transferid': row[0],
                             'sender_first_name': row[1],
                         'sender_last_name': row[2],
                         'recipient_first_name': row[3],
                         'recipient_last_name': row[4], 
                         'amount': row[5],
                         'date' : row[6]} for row in result]

        return largestTransfers
    
    def transfersByDate(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT 
            t.TransferID,
            sender.first_name AS sender_first_name,
            sender.last_name AS sender_last_name,
            recipient.first_name AS recipient_first_name,
            recipient.last_name AS recipient_last_name,
            t.amount,
            t.date
        FROM 
            Transfers t
        JOIN 
            People sender ON t.senderID = sender.personID
        JOIN 
            People recipient ON t.recipientID = recipient.personID
        ORDER BY 
            t.date DESC;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        transfers = [{'transferid': row[0],
                             'sender_first_name': row[1],
                         'sender_last_name': row[2],
                         'recipient_first_name': row[3],
                         'recipient_last_name': row[4], 
                         'amount': row[5],
                         'date' : row[6]} for row in result]

        return transfers
    
    def storeTransactionCounts(self):
        conn = getDBConnection()
        cursor = conn.cursor()

        query = """
        SELECT 
            store, 
            COUNT(*) AS num_transactions
        FROM 
            Transactions
        GROUP BY 
            store
        ORDER BY 
            num_transactions DESC;
        """
        cursor.execute(query)

        result = cursor.fetchall()

        if not result:
            return None
        
        store = [{'store': row[0], 'num_transactions': row[1]} for row in result]

        return store