import psycopg2

def getDBConnection():

    connection = psycopg2.connect(
        host = "TBD",
        database = "postgres",
        user = "postgres",
        password = "DummyWebsiteDBpassword"
    )

    return connection