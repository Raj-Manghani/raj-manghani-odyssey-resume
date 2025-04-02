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

## Running with Docker Compose (HTTP Only - Original Setup)

This describes the initial Docker Compose setup without the reverse proxy and HTTPS.

1.  **Prerequisites:** Docker and Docker Compose installed.
2.  **Build and Run:** Navigate to the project root directory and run:
    ```bash
    # Ensure you are using an appropriate docker-compose.yml for this setup
    docker compose up --build -d
    ```
    *   `--build`: Builds the images if they don't exist or if the Dockerfiles have changed.
    *   `-d`: Runs the containers in detached mode (in the background).
3.  **Access:** Open your browser to `http://localhost:8080` (or the host IP if remote).
4.  **Stopping:** To stop the containers, run:
    ```bash
    docker compose down
    ```

## Deployment with HTTPS (Docker Compose & Let's Encrypt)

This section details deploying the application using the Nginx reverse proxy configuration with automatic SSL certificate generation and renewal via Certbot and Let's Encrypt.

**Prerequisites:**

*   A server with Docker and Docker Compose installed.
*   A registered domain name (e.g., `yourdomain.com`).
*   A subdomain pointed via a DNS `A` record to your server's public IP address (e.g., `resume.yourdomain.com` -> `SERVER_IP`). Ensure DNS has propagated.
*   Ports 80 (for HTTP / ACME challenge) and 443 (for HTTPS) open on your server's firewall (e.g., AWS Security Group, ufw).
*   You are using the **final versions** of `docker-compose.yml` and `proxy/nginx.conf` which include the `proxy` and `certbot` services and have HTTPS enabled in the Nginx configuration.

**Steps:**

1.  **Prepare Environment:**
    *   Clone the repository to your server if you haven't already.
    *   Navigate to the project directory: `cd raj-manghani-odyssey-resume`
    *   Ensure your DNS `A` record (e.g., `resume.devbyraj.com`) points correctly to your server IP and has propagated (check with `ping resume.devbyraj.com` or online DNS tools).
    *   Verify ports 80 and 443 are open inbound on your server firewall/security group.
    *   Modify `proxy/nginx.conf` to replace `resume.devbyraj.com` with **your actual subdomain** in both `server_name` directives.

2.  **Obtain Initial SSL Certificate (IMPORTANT: Do this *before* starting all services with `up -d`):**
    *   We use `docker-compose run` first because it starts *only* the Certbot container and its dependencies (like the network), allowing Certbot to request the certificate *without* starting the main Nginx proxy. If Nginx started first, it would fail because the certificate files don't exist yet.
    *   **Run Staging Test:** It's highly recommended to test against the Let's Encrypt staging environment first to avoid rate limits if there's an issue. Replace placeholders with your details.
        ```bash
        sudo docker-compose run --rm certbot certonly --webroot -w /var/www/certbot \
            --email YOUR_EMAIL@example.com \
            -d resume.yourdomain.com \
            --agree-tos --no-eff-email \
            --staging
        ```
        *   Replace `YOUR_EMAIL@example.com` with your email.
        *   Replace `resume.yourdomain.com` with your actual subdomain.
        *   Look for a "Successfully received certificate" message. If it fails, troubleshoot DNS, firewall, or Nginx challenge location config before proceeding.
    *   **Run Production Command:** Only if the staging command succeeded, run the same command again *without* the `--staging` flag to get the real, browser-trusted certificate. Use `--force-renewal` if you encountered issues and need to overwrite previous attempts.
        ```bash
        sudo docker-compose run --rm certbot certonly --webroot -w /var/www/certbot \
            --email YOUR_EMAIL@example.com \
            -d resume.yourdomain.com \
            --agree-tos --no-eff-email \
            --force-renewal
        ```
        *   Replace placeholders again.
        *   Look for the "Successfully received certificate" message.

3.  **Start All Services:**
    *   Now that the production certificates exist in the persistent volume (`certbot_certs`), you can safely start all services, including the Nginx proxy which will load the certificates.
    *   Ensure your `docker-compose.yml` has the `entrypoint:` line for the `certbot` service **uncommented** for auto-renewal.
        ```bash
        sudo docker-compose up -d
        ```

4.  **Verify:**
    *   Check container status: `sudo docker ps -a` (All services should be `Up`).
    *   Open your browser and navigate to `https://resume.yourdomain.com`.
    *   Verify the padlock icon appears, indicating a secure connection. Test site functionality, including the terminal.

**Optional: Security Hardening (DH Params & SSL Options)**

The `certonly --webroot` method doesn't automatically create recommended SSL parameter files. You can add them manually for enhanced security. This is a one-time setup.

1.  **Find Volume Path:** Locate where Docker stores the cert volume on the host:
    ```bash
    sudo docker volume inspect raj-manghani-odyssey-resume_certbot_certs
    # Note the "Mountpoint" value (e.g., /var/lib/docker/volumes/raj-manghani-odyssey-resume_certbot_certs/_data)
    ```
2.  **Generate DH Params:** Navigate to the `_data` directory from the mountpoint and generate the file (this takes time):
    ```bash
    # Example: cd /var/lib/docker/volumes/raj-manghani-odyssey-resume_certbot_certs/_data
    sudo openssl dhparam -out ssl-dhparams.pem 2048
    sudo chmod 644 ssl-dhparams.pem
    ```
3.  **Download SSL Options:** Download the recommended options file into the same directory:
    ```bash
    # Make sure you are in the correct _data directory
    sudo curl -o options-ssl-nginx.conf https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf
    sudo chmod 644 options-ssl-nginx.conf
    ```
4.  **Update Nginx Config:** Edit `proxy/nginx.conf` in your project directory. Uncomment the following two lines within the `server { listen 443... }` block:
    ```nginx
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    ```
5.  **Restart Nginx:** Apply the changes:
    ```bash
    sudo docker-compose restart proxy
    ```

---

## Code Repository

The source code is publicly available on GitHub:
https://github.com/Raj-Manghani/raj-manghani-odyssey-resume