 # Raj Manghani - Odyssey Resume

This is an interactive online resume and portfolio showcasing skills in React, Three.js, and web development, presented as an journey through the solar system.

## Features

*   Interactive 3D Solar System built with React Three Fiber & Drei.
*   Clickable planets and moons with informational panels.
*   Detailed resume sections: About, Skills, Expertise, Experience, Projects, Contact.
*   Smooth scrolling and animations using GSAP & ScrollTrigger.
*   Interactive terminal (when exploring the solar system) showcasing backend environment details via WebSockets.
*   Responsive design.

## Technologies Used

*   **Frontend:** React, Vite, JavaScript, Three.js, React Three Fiber, Drei, GSAP, react-tsparticles, Sass (SCSS), CSS Modules
*   **Backend (Terminal):** Node.js, Express, WebSockets (`ws`)
*   **Containerization:** Docker, Nginx (for frontend static files)

## Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Raj-Manghani/raj-manghani-odyssey-resume.git
    cd raj-manghani-odyssey-resume
    ```
2.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```
3.  **Install Backend Dependencies:**
    ```bash
    cd terminal-backend
    npm install
    cd ..
    ```
4.  **Run Backend Server:**
    ```bash
    cd terminal-backend
    npm start
    # Server runs on port 3001 by default
    ```
5.  **Run Frontend Dev Server (in a separate terminal):**
    ```bash
    npm run dev -- --host
    # Access via http://<your-ip>:<port> shown in output
    ```
    *(Note: Use `--host` to make it accessible on your local network if needed. Access via IP address if hostname resolution fails)*

## Running with Docker (using Docker Compose)

This application is designed to run as two separate containers managed by Docker Compose.

1.  **Prerequisites:** Docker and Docker Compose installed.
2.  **Build and Run:** Navigate to the project root directory in your terminal and run:
    ```bash
    docker compose up --build -d
    ```
    *   `--build`: Builds the images if they don't exist or if the Dockerfiles have changed.
    *   `-d`: Runs the containers in detached mode (in the background).
3.  **Access:** Open your browser to `http://localhost:8080`. The interactive terminal will connect to the backend container automatically.
4.  **Stopping:** To stop the containers, run:
    ```bash
    docker compose down
    ```

## Running with Docker (Manual Build/Run)

Alternatively, you can build and run the containers manually:

1.  **Prerequisites:** Docker installed.
2.  **Build the Images:**
    ```bash
    # Build frontend image (serves static files via Nginx)
    docker build -f Dockerfile.frontend -t odyssey-resume-frontend .

    # Build backend image (runs the Node.js WebSocket server)
    docker build -f Dockerfile.backend -t odyssey-resume-backend .
    ```
3.  **Run the Containers:**
    ```bash
    # Run backend container
    docker run -d --name odyssey-backend -p 3001:3001 \
      -e DEPLOYMENT_MODE=docker \
      -e APP_ROOT_DIR=/app \
      odyssey-resume-backend

    # Run frontend container
    docker run -d --name odyssey-frontend -p 8080:80 \
      odyssey-resume-frontend
    ```
4.  **Access:** Open your browser to `http://<your-docker-host-ip>:8080`. If running Docker locally, this is usually `http://localhost:8080`. The interactive terminal will connect to the backend container automatically.


## Code Repository

The source code is publicly available on GitHub:
https://github.com/Raj-Manghani/raj-manghani-odyssey-resume
