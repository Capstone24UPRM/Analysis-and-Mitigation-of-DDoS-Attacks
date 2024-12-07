# Analysis and Mitigation of DDoS Attacks
Capstone Project

## Getting Started

### Front-end

The front-end is built using [Next.js](https://nextjs.org/).

1. Navigate to the `front-end` directory:
    ```sh
    cd Dashboard/front-end
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Run the development server:
    ```sh
    npm run dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

### Back-end

The back-end is built using [Express.js](https://expressjs.com/).

1. Navigate to the `back-end` directory:
    ```sh
    cd Dasboard/back-end
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Run the development server:
    ```sh
    npm run dev
    ```

4. The server will be running at [http://localhost:3001](http://localhost:3001).

## Machine Learning

The `ML` directory contains a Jupyter notebook for the Random Forest Classifier model used in the project.

- [RandomForrestClassifiermodel.ipynb](ML/RandomForrestClassifiermodel.ipynb)


### Network Sniffer

The Network Sniffer is built with python and Scapy python library.

1. Navigate to the `ML` directory:
    ```sh
    cd ML
    ```

2. Install the dependencies:
    ```sh
    pip3 install -r requirements.txt
    ```

3. Run the development server:
    ```sh
    python3 ScapyScrapper.py
    ```

### Mitigations API

1. Navigate to the `ML/Mitigations` directory:
    ```sh
    cd ML/Mitigations
    ```

2. Install the dependencies:
    ```sh
    pip3 install -r requirements.txt
    ```

3. Run the development server:
    ```sh
    python3 mitigations_apy.py
    ```