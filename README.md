## Backend Configuration

Before running the backend server, you need to create a `.env` file in the `backend` directory. This file will store your Gemini API key.

1.  Create a file named `.env` in the `backend` directory.
2.  Add the following line to the `.env` file:

    ```
    GEMINI_API_KEY=your_api_key_here
    ```

    Replace `your_api_key_here` with your actual Gemini API key.

To run the application, please follow these steps from your project's root directory:

1.  **Start the backend server:**
    Open a terminal and run:
    ```bash
    cd backend
    npm start
    ```
    The backend server will start running (typically on `http://localhost:3000`).

2.  **Launch the frontend:**
    Open a **separate terminal** and run:
    ```bash
    npm run dev
    ```

3.  **Open your browser:**
    Navigate to `http://localhost:5173` to access the application.

Both the backend and frontend must be running simultaneously for the app to function properly.
