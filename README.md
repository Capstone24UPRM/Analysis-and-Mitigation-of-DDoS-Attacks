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

## API Endpoints

### Status Endpoints

- **GET** `/status/mitigation` - Returns the mitigation status.
- **GET** `/status/attack` - Returns the attack status.
- **GET** `/status/backend` - Returns the backend server status.
- **GET** `/status/website` - Returns the website status.

### Action Endpoints

- **POST** `/start` - Starts the attack. Requires a `simulation` value in the request body.
- **POST** `/defend` - Starts defending against the attack.
- **POST** `/off` - Stops the attack and mitigation.

## Machine Learning

The `ML` directory contains a Jupyter notebook for the Random Forest Classifier model used in the project.

- [RandomForrestClassifiermodel.ipynb](ML/RandomForrestClassifiermodel.ipynb)



