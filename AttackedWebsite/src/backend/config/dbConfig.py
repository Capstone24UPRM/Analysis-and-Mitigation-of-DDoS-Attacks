import psycopg2

def getDBConnection():

    connection = psycopg2.connect(
        host = "PLACEHOLDER",
        database = "PLACEHOLDER",
        user = "PLACEHOLDER",
        password = "PLACEHOLDER"
    )

    return connection