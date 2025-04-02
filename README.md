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
*   **Containerization & Proxy:** Docker, Docker Compose, Nginx (as reverse proxy and for frontend static files), Certbot (for SSL)

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

## Running with Docker Compose (HTTP Only - Simple Setup)

This method runs the frontend and backend containers directly, exposing their ports via HTTP. It does **not** use the Nginx reverse proxy or Certbot for HTTPS. This is suitable for local Docker testing or simpler deployments where HTTPS is handled externally or not required.

1.  **Prerequisites:** Docker and Docker Compose installed.
2.  **Create `docker-compose.http.yml`:** Create a file named `docker-compose.http.yml` in the project root directory with the following content:
    ```yaml
    # docker-compose.http.yml
    # Simple setup exposing ports directly (HTTP only)

    version: '3.8'

    services:
      frontend:
        build:
          context: .
          dockerfile: Dockerfile.frontend
        container_name: odyssey-frontend-http
        ports:
          # Expose Nginx inside frontend container on host port 8080
          - "8080:80"
        restart: unless-stopped

      backend:
        build:
          context: .
          dockerfile: Dockerfile.backend
        container_name: odyssey-backend-http
        ports:
          # Expose Node.js backend container on host port 3001
          - "3001:3001"
        environment:
          - DEPLOYMENT_MODE=docker
          - APP_ROOT_DIR=/app
        restart: unless-stopped

    # Note: No proxy or certbot services, no shared network needed beyond default
    ```
3.  **Build and Run:** Navigate to the project root directory and run:
    ```bash
    docker compose -f docker-compose.http.yml up --build -d
    ```
    *   `-f docker-compose.http.yml`: Specifies which compose file to use.
    *   `--build`: Builds the images if needed.
    *   `-d`: Runs in detached mode.
4.  **Access:** Open your browser to `http://localhost:8080` (or the host IP if remote, e.g., `http://YOUR_SERVER_IP:8080`). The terminal will attempt to connect to the backend via WebSocket on port 3001 (ensure your frontend code handles this connection URL appropriately for this setup, likely `ws://localhost:3001` or `ws://YOUR_SERVER_IP:3001`).
5.  **Stopping:** To stop these specific containers, run:
    ```bash
    docker compose -f docker-compose.http.yml down
    ```

## Deployment with HTTPS (Docker Compose & Let's Encrypt)

This section details deploying the application using the **main `docker-compose.yml` file**, which includes the Nginx reverse proxy configuration with automatic SSL certificate generation and renewal via Certbot and Let's Encrypt. This is the recommended setup for production or public-facing deployments.

**Prerequisites:**

*   A server with Docker and Docker Compose installed.
*   A registered domain name (e.g., `yourdomain.com`).
*   A subdomain pointed via a DNS `A` record to your server's public IP address (e.g., `resume.yourdomain.com` -> `SERVER_IP`). Ensure DNS has propagated.
*   Ports 80 (for HTTP / ACME challenge) and 443 (for HTTPS) open on your server's firewall (e.g., AWS Security Group, ufw).
*   You are using the **final deployment versions** of `docker-compose.yml` and `proxy/nginx.conf`.

**Steps:**

1.  **Prepare Environment:**
    *   Clone the repository to your server.
    *   Navigate to the project directory: `cd raj-manghani-odyssey-resume`
    *   Ensure your DNS `A` record (e.g., `resume.devbyraj.com`) points correctly to your server IP and has propagated.
    *   Verify ports 80 and 443 are open inbound.
    *   Modify `proxy/nginx.conf` to replace `resume.devbyraj.com` with **your actual subdomain** in both `server_name` directives.
    *   Modify `docker-compose.yml` and **comment out the `entrypoint:` line** under the `certbot` service definition. This is temporary, only needed for the *initial* certificate request using `docker-compose run`. Save the file.

2.  **Start Nginx Temporarily (if not running):** The Nginx proxy needs to be running to serve the challenge, but using a config where HTTPS is commented out or non-blocking initially. *If following sequentially, the previous steps ensure Nginx can start.* Ensure Nginx is running:
    ```bash
    # Optional: Ensure Nginx is up with temporary config if needed
    # sudo docker-compose up -d proxy
    ```

3.  **Obtain Initial SSL Certificate:**
    *   **Run Staging Test:** Replace placeholders.
        ```bash
        sudo docker-compose run --rm certbot certonly --webroot -w /var/www/certbot \
            --email YOUR_EMAIL@example.com \
            -d resume.yourdomain.com \
            --agree-tos --no-eff-email \
            --staging
        ```
        *   Troubleshoot if fails.
    *   **Run Production Command:** Only if staging succeeded, run without `--staging`. Use `--force-renewal` if needed.
        ```bash
        sudo docker-compose run --rm certbot certonly --webroot -w /var/www/certbot \
            --email YOUR_EMAIL@example.com \
            -d resume.yourdomain.com \
            --agree-tos --no-eff-email \
            --force-renewal
        ```
        *   Ensure success.

4.  **Finalize Configuration:**
    *   Edit `proxy/nginx.conf` and ensure the **final version** (with the full HTTPS server block uncommented and configured) is saved.
    *   Edit `docker-compose.yml` and **uncomment the `entrypoint:` line** under the `certbot` service definition to enable auto-renewal. Save the file.

5.  **Start All Services:**
    ```bash
    sudo docker-compose down # Stop any temporary containers
    sudo docker-compose up -d # Start with final configurations
    ```

6.  **Verify:**
    *   Check container status: `sudo docker ps -a` (All services should be `Up`).
    *   Open `https://resume.yourdomain.com` and verify HTTPS and site functionality.

**(Optional: Security Hardening instructions remain the same)**

---

## Code Repository

The source code is publicly available on GitHub:
https://github.com/Raj-Manghani/raj-manghani-odyssey-resume