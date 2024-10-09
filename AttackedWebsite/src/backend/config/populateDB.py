import json
import yaml
import csv
import xmltodict


import psycopg2

def getDBConnection():

    connection = psycopg2.connect(
        host = "database-1.cfqoe6eegbbf.us-east-2.rds.amazonaws.com",
        database = "postgres",
        user = "postgres",
        password = "DummyWebsiteDBpassword"
    )

    return connection

class populateDB:

    def __init__(self):
        self.createPeopleTable = """
        CREATE TABLE IF NOT EXISTS People(
        personID INTEGER PRIMARY KEY, 
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        telephone VARCHAR(25) UNIQUE,
        email VARCHAR(100) UNIQUE,
        city VARCHAR(100),
        country VARCHAR(100),
        devices VARCHAR(35)[]
        )
        """
        self.createPromotionsTable = """
        CREATE TABLE IF NOT EXISTS Promotions(
        promotionID INTEGER PRIMARY KEY,
        telephone VARCHAR(25),
        email VARCHAR(100),
        promotion_name VARCHAR(100),
        responded BOOLEAN,
        FOREIGN KEY (telephone) REFERENCES People(telephone),
        FOREIGN KEY (email) REFERENCES People(email)
        ) """
        self.createTransactionsTable = """
        CREATE TABLE IF NOT EXISTS Transactions (
        TransactionID INTEGER PRIMARY KEY,
        telephone VARCHAR(25),
        store VARCHAR(100),
        FOREIGN KEY (telephone) REFERENCES People(telephone)
        )
        """
        self.createTransactionItemsTable = """
        CREATE TABLE IF NOT EXISTS TransactionItem (
        TransactionItemID SERIAL PRIMARY KEY,
        TransactionID INTEGER,
        item_name VARCHAR(100),
        price DECIMAL,
        price_per_item DECIMAL,
        quantity DECIMAL,
        FOREIGN KEY (TransactionID) REFERENCES Transactions(TransactionID)
        )
        """
        self.createTransferTable = """
        CREATE TABLE IF NOT EXISTS Transfers (
        TransferID SERIAL PRIMARY KEY,
        senderID INTEGER,
        recipientID INTEGER,
        amount DECIMAL,
        date DATE,
        FOREIGN KEY (senderID) REFERENCES People(PersonID),
        FOREIGN KEY (recipientID) REFERENCES People(PersonID)
        )
        """

    def create_tables(self):
        conn = getDBConnection()

        cursor = conn.cursor()

        cursor.execute(self.createPeopleTable)
        cursor.execute(self.createPromotionsTable)
        cursor.execute(self.createTransactionsTable)
        cursor.execute(self.createTransactionItemsTable)
        cursor.execute(self.createTransferTable)

        conn.commit()
        conn.close()

    def insert_person(self, cursor, person_data):
        queryVerify = """
            SELECT personID FROM People
            WHERE personID = %s 
        """
        personID = person_data['id']

        cursor.execute(queryVerify, (personID,))
        
        result = cursor.fetchone()
        
        # If the person_id exists, return it and skip to the next insertion.
        if result:
            return
        

        # Insert person to the database table.
        query = """
        INSERT INTO People (
        personID, first_name, last_name, telephone, email, city, country, devices)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING personID
        """
        data = (person_data.get('id'),
        person_data.get('first_name'),
        person_data.get('last_name'),
        person_data.get('telephone'),
        person_data.get('email'),
        person_data.get('city'),
        person_data.get('country'),
        person_data.get('devices'))
        
        cursor.execute(query, data)
    
    def populatePeople(self, JSONpath, YAMLpath):

        rf = open(JSONpath, 'r')
        people_json = json.load(rf)

        yf = open(YAMLpath, 'r')
        people_yaml = yaml.safe_load(yf)

        conn = getDBConnection()

        cursor = conn.cursor()

        for person in people_json:
            person_data = {
            'id' : person.get('id'),
            'first_name': person.get('first_name'),
            'last_name': person.get('last_name'),
            'telephone': person.get('telephone'),
            'email': person.get('email'),
            'city': person.get('location', {}).get('City'),
            'country': person.get('location', {}).get('Country'),
            'devices': person.get('devices', [])
            }
            self.insert_person(cursor, person_data)

        for person in people_yaml:
            devices = []
            if person.get('Android') == 1:
                devices.append('Android')
            if person.get('Desktop') == 1:
                devices.append('Desktop')
            if person.get('Iphone') == 1:
                devices.append('Iphone')

            place = person.get('city', '')
            parts = [part.strip() for part in place.split(',')]
            city, country = parts


            person_data = {
            'id' : person.get('id'),
            'first_name': person.get('name').split(' ')[0],
            'last_name': person.get('name').split(' ')[1],
            'telephone': person.get('phone'),
            'email': person.get('email'),
            'city': city,
            'country': country,
            'devices': devices
            }
            self.insert_person(cursor, person_data)

        conn.commit()
        conn.close()
        rf.close()
        yf.close()     
    
    def populatePromotions(self, CSVpath):
        f = open(CSVpath, 'r', encoding='utf-8-sig')
        promotions = csv.DictReader(f)

        conn = getDBConnection()

        cursor = conn.cursor()

        for promotion in promotions:
            id = promotion['id']
            telephone = promotion['telephone']
            if not telephone.strip():
                telephone = None
            email = promotion['client_email']
            if not email.strip():
                email = None
            name = promotion['promotion']
            response = promotion['responded']

            cursor.execute("""
            INSERT INTO Promotions (
                promotionID, telephone, email, promotion_name, responded               
            ) VALUES (%s, %s, %s, %s, %s)
            """, (id, telephone, email, name, response))

        conn.commit()
        conn.close()
        f.close()

    def populateTransactions(self, XMLpath):
        f = open(XMLpath, 'r')
        data = xmltodict.parse(f.read())

        conn = getDBConnection()

        cursor = conn.cursor()

        transactions = data.get('transactions', {}).get('transaction', [])

        for transaction in transactions:
            id = transaction.get('@id')
            telephone = transaction.get('phone')
            store = transaction.get('store')
            cursor.execute("""
            INSERT INTO Transactions (
                transactionID, telephone, store               
            ) VALUES (%s, %s, %s)
            """, (id, telephone, store))

            items = transaction.get('items', {}).get('item', [])
            if isinstance(items, dict):
                items = [items]

            for item in items:
                cursor.execute("""
                INSERT INTO TransactionItem (
                    transactionID, item_name, price, price_per_item, quantity              
                ) VALUES (%s, %s, %s, %s, %s)
                """, (id,
                      item.get('item'),
                      item.get('price'),
                      item.get('price_per_item'),
                      item.get('quantity')))

        conn.commit()
        conn.close()
        f.close()

    def populateTransfers(self, CSVpath):
        f = open(CSVpath, 'r', encoding='utf-8-sig')
        transfers = csv.DictReader(f)

        conn = getDBConnection()

        cursor = conn.cursor()

        for transfer in transfers:
            sender = transfer['sender_id']
            recipient = transfer['recipient_id']
            amount = transfer['amount']
            date = transfer['date']

            cursor.execute("""
            INSERT INTO Transfers (
                senderID, recipientID, amount, date               
            ) VALUES (%s, %s, %s, %s)
            """, (sender, recipient, amount, date))

        conn.commit()
        conn.close()
        f.close()



if __name__ == "__main__":
    populate = populateDB()

    # populate.create_tables()
    # populate.populatePeople('data/people.json', 'data/people.yml')
    # populate.populatePromotions('data/promotions.csv')
    # populate.populateTransfers('data/transfers.csv')
    # populate.populateTransactions('data/transactions.xml')