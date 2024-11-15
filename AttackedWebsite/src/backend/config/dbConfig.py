import psycopg2

def getDBConnection():

    connection = psycopg2.connect(
        host = "localhost",
        database = "postgres",
        user = "postgres",
        password = "postgres"
    )

    return connection