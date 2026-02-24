# Employment Trends in a Changing Economy

  - Analyzing Employment Projections Pre- and Post-Pandemic (2019-2029 vs. 2023-2033)
  - Visualizing the Skill requirements for a particular Job Oppertunities

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Python Scripts](#python-scripts)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Notes](#notes)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** installed on your system. You can download it [here](https://nodejs.org/).
- **Python** installed on your system. You can download it [here](https://www.python.org/).
- **npm** (Node Package Manager) comes with Node.js.
- Basic knowledge of command-line operations.

## Installation

### Frontend

1. Navigate to the `frontend` directory:

    ```bash
    cd frontend
    ```

2. Install the necessary dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

### Backend

1. Return to the main project directory:

    ```bash
    cd ..
    ```

2. Navigate to the `backend` directory:

    ```bash
    cd backend
    ```

3. Install the necessary dependencies:

    ```bash
    npm install
    ```

4. Start the backend server:

    ```bash
    node index.js
    ```

    **Note:** Ensure you have Node.js installed on your system.

### Python Scripts

1. Navigate to the directory containing the Python scripts (if not already there).

2. Install the required Python packages:

    ```bash
    pip install numpy pandas matplotlib websockets asyncio
    ```

    Alternatively, there's a `requirements.txt` file, run:

    ```bash
    pip install -r requirements.txt
    ```

3. Open the Python file (e.g., `script.py`) in your preferred IDE or editor.

4. Run the script by executing all cells sequentially. **Important:** The cell containing the WebSocket connection should be the last one you run, as it will continue to run indefinitely.

## Usage

1. **Frontend:** After starting the frontend development server, open your browser and navigate to `http://localhost:5173` (or the specified port) to view the frontend application.

2. **Backend:** The backend server will be running on `http://localhost:3000` (or the specified port). Ensure the frontend is configured to communicate with the backend correctly.

3. **Python Scripts:** Execute the Python scripts as described in the [Python Scripts](#python-scripts) section.

## Dependencies

### Node.js Dependencies

- List your frontend and backend dependencies here, or reference the `package.json` files.

### Python Dependencies

- `numpy`
- `pandas`
- `matplotlib`
- `websockets`
- `asyncio`
- *Other dependencies as required.*

## Notes

- If you encounter any errors related to missing packages, install them using `npm install <package-name>` for Node.js dependencies or `pip install <package-name>` for Python dependencies.

- Ensure that ports used by the frontend and backend are not blocked or used by other applications.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

