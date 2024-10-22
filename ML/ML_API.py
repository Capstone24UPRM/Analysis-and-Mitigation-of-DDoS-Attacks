from flask import Flask, request, jsonify
import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)

model = joblib.load('RFCmodel.pkl')

# Calculate and transform features
def preProcessing(df):
    le = LabelEncoder()
    df['PKT_TYPE'] = le.fit_transform(df['PKT_TYPE'])
    df['FLAGS'] = le.fit_transform(df['FLAGS'])
    df['NODE_NAME_FROM'] = le.fit_transform(df['NODE_NAME_FROM'])
    df['NODE_NAME_TO'] = le.fit_transform(df['NODE_NAME_TO'])
    df['session_duration'] = abs(df['LAST_PKT_RESEVED'] - df['FIRST_PKT_SENT'])
    df['request_time'] = abs(df['PKT_RESEVED_TIME'] - df['PKT_SEND_TIME'])
    df['ttl'] = df['session_duration'] - 64
    df['request_rate'] = df['NUMBER_OF_PKT'] / df['session_duration']

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    df = pd.DataFrame(data)
    preProcessing(df)

    # Select model features
    x_data = df[['PKT_TYPE', 'FLAGS', 'NUMBER_OF_PKT', 'PKT_R', 'PKT_RATE', 'UTILIZATION',
 'PKT_DELAY', 'session_duration', 'ttl' ,'request_rate']]

    prediction = model.predict(x_data)
    
    # Convert to python int/float
    pred = prediction[0].item()
    
    return jsonify({'prediction': pred})

if __name__ == '__main__':
    app.run(debug=True)