import sys
sys.dont_write_bytecode = True

from flask import Flask
from flask_cors import CORS

from Routes.statistics import statistics_bp

app = Flask(__name__)

app.register_blueprint(statistics_bp)

@app.route('/')
def login():

    return "Welocome to DummyWebsite, your solution to everyday problems"

CORS(app)

if __name__ == "__main__":
    app.run(debug=True)