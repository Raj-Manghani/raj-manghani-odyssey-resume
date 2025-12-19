# 502 Proxy Issue – DevOps Monitor (Grafana)

## Stack Overview
- **frontend** (`rajmanghani/…-frontend`): React/Vite build served by Nginx inside the container.
- **backend** (`rajmanghani/…-backend`): Node/Express+WS server powering the on-page terminal over `/ws/`.
- **proxy** (`nginx:stable-alpine`): Public-facing Nginx terminating TLS, routing:
  - `/` → `frontend:80`
  - `/ws/` → `backend:3001`
  - `/grafana/` → `127.0.0.1:3012` (reverse-tunneled Grafana)
- **certbot**: Handles Let’s Encrypt renewals.
- **Monitoring host** (local VM): runs Grafana, Prometheus, Loki, etc. via `grafana-compose.yml`. Grafana listens on `localhost:3000`.
- **Reverse tunnel**: from the monitoring VM to AWS via `ssh -R 3012:localhost:3000 …`. The tunnel is supposed to expose Grafana to the AWS host on port `127.0.0.1:3012`, so the proxy can serve `/grafana/`.

## What Works
- Frontend and backend containers serve traffic fine (`/`, `/ws/` tested via app).
- `proxy/nginx.conf` has been updated to `proxy_pass http://127.0.0.1:3012/;` under `location /grafana/`.
- Frontend shows the DevOps Monitor button and on click navigates to `/grafana/`.
- On the AWS host:
  - `curl -I http://127.0.0.1:3012/login -H "Host: resume.devbyraj.com"` returns `301` and points to `https://resume.devbyraj.com/grafana/login` (after tunnel is re-established).
  - Containers (`odyssey-frontend`, `odyssey-backend`, `nginx-proxy`, `certbot`) are up with tag `14e1b6e`.
- On the monitoring VM:
  - Grafana container logs show it’s healthy and redirecting to `/grafana/login` per the `GF_SERVER_ROOT_URL`/`GF_SERVER_SERVE_FROM_SUB_PATH` env vars.
  - The monitoring stack runs via `grafana-compose.yml` (Prometheus, Loki, Grafana, etc.).

## 502 Symptoms
- Browser request to `https://resume.devbyraj.com/grafana/` shows `502 Bad Gateway`.
- `sudo docker logs nginx-proxy` contains repeated entries:
  ```
  connect() failed (111: Connection refused) while connecting to upstream,
  client: 50.113.79.127, server: resume.devbyraj.com,
  request: "GET /grafana/ HTTP/2.0", upstream: "http://127.0.0.1:3012/"
  ```
  This indicates the proxy cannot open a TCP connection to 127.0.0.1:3012 at the moment of the request.
- When the reverse tunnel is up, these errors go away temporarily, but they reappear whenever the tunnel drops (e.g., laptop sleeps, SSH process dies).

## Actions Taken
1. **Updated app code**: `proxy/nginx.conf` changed to target `127.0.0.1:3012/` (instead of `host.docker.internal`), ensuring the AWS host’s loopback is used.
2. **Redeployed app**:
   - Stopped/remade containers (`docker rm -f odyssey-* certbot nginx-proxy`).
   - Rebuilt/pulled images via Jenkins and manual `docker compose up -d` with explicit `REGISTRY_URL`, `FRONTEND_IMAGE_TAG`, `BACKEND_IMAGE_TAG` environment variables.
3. **Monitoring side**:
   - Created `grafana-compose.yml`; restarted Grafana with `GF_SERVER_ROOT_URL=https://resume.devbyraj.com/grafana/` and `GF_SERVER_SERVE_FROM_SUB_PATH=true`.
   - Ensured `curl -I http://localhost:3000/login` redirects to `/grafana/login`.
4. **Reverse tunnel maintenance**:
   - Ran `ssh -R 3012:localhost:3000 …` with `nohup`.
   - Switched to `autossh -M 0 -f -o ExitOnForwardFailure=yes …` to keep the tunnel alive.
   - Used `ps aux | grep ssh | grep 3012` and `pkill -f "ssh.*3012"` to eliminate duplicate/broken tunnels.
5. **Verification commands**:
   - `curl -I http://127.0.0.1:3012/login -H "Host: resume.devbyraj.com"` (AWS) – confirms whether Grafana is reachable via the tunnel.
   - `sudo docker logs nginx-proxy | tail -n 40` – reveals `connect() failed (111)` errors that correlate with the 502s.
   - `sudo docker exec grafana env | grep GF_SERVER` & `curl -I http://localhost:3000/login` – verify Grafana config on the monitoring host.

## Current State (as of Dec 18, 2025 ~22:20 UTC)
- Containers on AWS are running (`docker ps` shows front/back/proxy/certbot).
- Reverse tunnel is up (`autossh` processes running; curl against 127.0.0.1:3012 returns 301).
- **Still seeing 502** when navigating to `/grafana/`, and `nginx-proxy` log shows new `connect() failed (111: Connection refused)` lines even after the tunnel reports as up.

## Hypotheses / Possible Causes
1. **Tunnel flapping**: Despite autossh, the port 3012 listener may not stay active long enough; the curl succeeds only right after restarting the tunnel but Nginx hits it when it’s already down. Need continuous monitoring (e.g., `watch -n5 curl -I ...` or `ss -ltnp | grep 3012`).
2. **Firewall/Security Group**: If AWS security groups or local firewall intermittently block the SSH tunnel, the connection could fail. However, SSH listens on 3012 and curl works, so less likely.
3. **SELinux/AppArmor**: Not enabled on Ubuntu by default, but confirm nothing blocks Nginx from reaching localhost.
4. **Grafana redirect loops**: Already mitigated by setting `GF_SERVER_ROOT_URL`/`serve_from_sub_path`, so currently the redirect target is correct (`/grafana/login`).
5. **Proxy caching upstream failure**: After multiple connection refusals, Nginx might mark the upstream as down temporarily. Reloading (`docker rm -f nginx-proxy && docker compose up -d proxy`) helps only if the tunnel is solid.

## Next Steps / Requests for Input
- Confirm autossh stays alive (use `systemctl --user status autossh` if running as a service) and no other process binds port 3012.
- Consider using a persistent VPN or direct Grafana exposure instead of a reverse SSH tunnel to reduce flakiness.
- Add monitoring on the AWS host to alert when port 3012 stops responding (e.g., simple systemd service with `curl` health checks).
- If anyone has insight into Nginx caching upstream failures or better tunnel management, feedback is welcome.

This document captures the troubleshooting track so far and the architecture context to help others diagnose the remaining 502 errors.
