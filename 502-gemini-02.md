The data you provided confirms that:
1.  **The tunnel is healthy:** Your `curl` to `127.0.0.1:3012` on the AWS host successfully reached Grafana and returned the expected 301 redirect.
2.  **The listener is active:** `ss` shows `sshd` is listening on `0.0.0.0:3012`, meaning it is accessible on all interfaces (loopback and private IP).

### The Contradiction
If `curl` works but Nginx returns `111: Connection refused`, there is a "Network Identity" mismatch. Even if `docker inspect` says `network_mode: host`, Nginx is clearly failing to see the host's loopback listener. This often happens because:
*   **The "Double Network" Trap:** If your `compose` file specifies `network_mode: host` but *also* defines a `networks:` block for that service, some Docker versions create a hybrid namespace where `127.0.0.1` inside the container does **not** map to the host's loopback, but the container still uses the host's IP for external traffic.
*   **IPv6/IPv4 Resolution:** Nginx might be attempting to resolve `localhost` or connect to `127.0.0.1` in a way that hits a container-local interface.

---

### The Fix: Bypass the Loopback Ambiguity

Since your tunnel is bound to `0.0.0.0:3012`, it is accessible via the **Private IP** of the EC2 instance. Using the Private IP instead of `127.0.0.1` bypasses the loopback entirely and is much more reliable in Docker "Host" or "Bridge" modes.

#### 1. Update Nginx Config
Change the `proxy_pass` to use the EC2 Private IP. Based on your prompt, your private IP is `172.31.16.147`.

```nginx
location /grafana/ {
    # Use the Private IP instead of 127.0.0.1 to avoid loopback namespace issues
    proxy_pass http://172.31.16.147:3012/;

    # FORCE Nginx to ignore "down" states and retry every time
    # This prevents the 502 from being "cached" by Nginx when the tunnel flaps
    proxy_next_upstream error timeout http_502;
    proxy_connect_timeout 2s;
    
    # Standard headers
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

#### 2. Why this works
When Nginx tries to connect to `172.31.16.147`, it goes out through the eth0 interface (or the host's primary stack). Since `sshd` is listening on `0.0.0.0`, it will accept the connection. This sidesteps the question of whether the Nginx container "owns" `127.0.0.1` or if the host "owns" it.

#### 3. Handle the "Zombie" SSH socket
Your `ss` output shows the process is alive, but keep an eye on it. If you still see 502s, run this one-liner on the AWS Host to verify if the **Nginx container** can actually talk to that port:

```bash
sudo docker exec nginx-proxy curl -I http://172.31.16.147:3012/login
```

*   If this returns **301**, then Nginx is fixed.
*   If this returns **Connection Refused**, then your AWS Security Group or `iptables` is blocking the Docker container from talking to the host's Private IP (rare, but happens if `ufw` is active).

### Summary of recommendations
1.  **Modify Nginx:** Switch `127.0.0.1` to `172.31.16.147` (the private IP).
2.  **Modify Nginx:** Add `proxy_next_upstream error timeout http_502;` to the `/grafana/` block.
3.  **Update autossh:** Use the `-o ServerAliveInterval=10` and `-o ServerAliveCountMax=3` flags I mentioned earlier to ensure the tunnel doesn't become a "zombie" where the port is open but no data flows.

**Next step:** Update the `proxy/nginx.conf` with the Private IP and reload the proxy (`docker exec nginx-proxy nginx -s reload`). That should clear the 502 immediately.