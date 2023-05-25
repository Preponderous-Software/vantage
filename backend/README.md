# Vantage Backend
The backend is intended to manage the minecraft server and provide an API for the frontend to interact with.

## Pre-requisites
- Java 17
- Postgres

## Setup
This guide assumes that you are using a fresh install of Ubuntu 20.04.

### Setup PostgreSQL Database
1. Connect to postgres using `sudo -u postgres psql`
1. Create a user called `vantage`.
1. Create a database called `vantage` owned by `vantage`.

### Setup Directory Structure
1. Create a folder called `vantage` in `opt` and `cd` into it

### Compile
1. Clone the repository into the folder as 'vantage-repo'
1. Cd into `vantage-repo/backend`
1. Compile the backend using `./gradlew build`
1. Move the compiled jar from `vantage-repo/backend/build/libs` to `vantage/vantage-backend`

### Create service
1. Create a file called `vantage-backend.service` in /etc/systemd/system/ with the following contents:

    ```ini
    [Unit]
    Description=Vantage backend

    [Service]
    WorkingDirectory=/opt/vantage/vantage-backend
    ExecStart=java -Xms1G -Xmx1G -jar vantage-2.0.1-all.jar
    User=vantage
    Type=exec
    Restart=on-failure
    RestartSec=10

    [Install]
    WantedBy=multi-user.target
    ```
    
1. Run `sudo systemctl daemon-reload`
1. Run `sudo systemctl enable vantage-backend`
1. Run `sudo systemctl start vantage-backend`
1. Run `sudo systemctl status vantage-backend` to verify that the service is running