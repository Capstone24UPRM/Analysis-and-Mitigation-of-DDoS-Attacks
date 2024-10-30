## Getting Started

### ML API

1. Navigate to the `ML` directory:

   ```sh
   cd ML
   ```

2. Create virtual environment:

   ```sh
   python -m venv .venv
   ```

3. Activate virtual environment:

   ```sh
   .venv/Scripts/activate
   ```

4. Install the dependencies:

   ```sh
   pip install -r requirements.txt
   ```

5. Run the development server:

   ```sh
   flask --app ML_API --debug run
   ```

6. Make requests to [http://localhost:5000](http://localhost:5000)

7. Virtual environment deactivation:

   ```sh
   deactivate
   ```

## API Endpoints

- **POST** `/predict` - Predicts traffic type.
