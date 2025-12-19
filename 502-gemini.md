Based on the symptoms and your setup, the **root cause** is almost certainly a **Docker Networking loopback mismatch.**

### The Root Cause: The "127.0.0.1" Trap
Inside your `nginx-proxy` container, `127.0.0.1` refers to the **container itself**, not the AWS Host. 

When Nginx tries to connect to `http://127.0.0.1:3012`, it looks for a process listening on port 3012 **inside the Nginx container**. Since your SSH tunnel is listening on port 3012 on the **AWS Host's loopback interface**, the Nginx container finds nothing and returns `111: Connection refused`.

**Why did `curl` work on the host?**
When you run `curl` directly on the AWS CLI, you are on the host. On the host, `127.0.0.1` correctly points to the SSH tunnel listener.

---

### The Fix

You need to bridge the gap between the Nginx container and the AWS host's loopback interface. Here are the three ways to fix this, ranked from "Best Practice" to "Quickest Fix":

#### Option 1: The "Clean" Way (Using `host.docker.internal`)
On Linux, Docker containers don't resolve `host.docker.internal` by default. You have to enable it.

1.  **Modify `docker-compose.yml`** for the `nginx-proxy` service:
    ```yaml
    services:
      proxy:
        image: nginx:stable-alpine
        extra_hosts:
          - "host.docker.internal:host-gateway"
        # ... rest of config
    ```
2.  **Update `nginx.conf`**:
    Change the `proxy_pass` to:
    ```nginx
    location /grafana/ {
        proxy_pass http://host.docker.internal:3012/;
    }
    ```

#### Option 2: The "Quickest" Way (Host Networking)
If you run the proxy on the host's network stack, `127.0.0.1` inside the container will be identical to `127.0.0.1` on the host.

1.  **Modify `docker-compose.yml`**:
    ```yaml
    services:
      proxy:
        network_mode: "host"
    ```
    *Note: If you do this, you remove port mappings (like `80:80`) because the container uses the host's ports directly.*

#### Option 3: The SSH Tunnel Adjustment (`GatewayPorts`)
By default, SSH tunnels only bind to `127.0.0.1`. Even if you use the host's IP (e.g., `172.17.0.1`), the tunnel will reject the connection because it's not coming from the loopback.

1.  **On the AWS Host**, edit `/etc/ssh/sshd_config`:
    ```bash
    GatewayPorts yes
    ```
2.  **Restart SSH**: `sudo systemctl restart ssh`
3.  **Restart your tunnel** using `0.0.0.0` to bind to all interfaces:
    ```bash
    ssh -R 0.0.0.0:3012:localhost:3000 user@aws-host
    ```
4.  **Update `nginx.conf`** to use the Docker bridge IP (usually `172.17.0.1`) instead of `127.0.0.1`.

---

### Recommended Action Plan
1.  **Implement Option 1**: It is the most "Docker-native" way to handle host communication.
2.  **Verify the Tunnel Binding**: Run `netstat -tulpn | grep 3012` on the AWS host. 
    *   If it says `127.0.0.1:3012`, only Option 1 or 2 will work.
    *   If it says `0.0.0.0:3012` or `:::3012`, any of the options will work.
3.  **Nginx Upstream Caching**: You mentioned Nginx might "mark the upstream as down." To prevent Nginx from giving up on the tunnel when it flaps, add this to your `location` block:
    ```nginx
    proxy_next_upstream error timeout invalid_header http_502;
    # Prevent marking upstream as down permanently
    proxy_connect_timeout 2s;
    ```

### Why the 502 persists currently?
Even though your `autossh` is running and `curl` on the host works, the **Nginx container is effectively knocking on its own door**, where no one is home. Switching to `host.docker.internal` (with the `host-gateway` mapping) tells Nginx to knock on the AWS Host's door instead.