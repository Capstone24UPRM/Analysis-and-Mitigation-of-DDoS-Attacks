# Analysis and Mitigation of DDoS Attacks
Capstone Project

## Getting Started

### Front-end

The front-end is built using [Next.js](https://nextjs.org/).

1. Navigate to the `front-end` directory:
    ```sh
    cd front-end
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
    cd back-end
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
- **GET** `/status/website` - Returns the website status.

### Action Endpoints

- **POST** `/start` - Starts the attack.
- **POST** `/defend` - Starts defending against the attack.
- **POST** `/off` - Stops the attack and mitigation.

## Machine Learning

The `ML` directory contains a Jupyter notebook for the Random Forest Classifier model used in the project.

- [RandomForrestClassifiermodel.ipynb](ML/RandomForrestClassifiermodel.ipynb)

## Learn More

To learn more about the technologies used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Express.js Documentation](https://expressjs.com/en/starter/installing.html) - Learn about Express.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial.

