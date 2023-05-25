# Vantage Frontend
The frontend is intended to be a simple and easy to use interface for managing your minecraft server.

## Setup
This guide assumes that you are using a fresh install of Ubuntu 20.04.

### Setup Node.js
1. Install Node.js using `sudo apt install nodejs`
1. Install npm using `sudo apt install npm`

### Setup Directory Structure
1. Create a folder called `vantage` in `opt` and `cd` into it
1. Clone the repository into the folder as 'vantage-repo'
1. Create a link to the frontend folder using `ln -s vantage-repo/frontend vantage-frontend`
1. Cd into `vantage-frontend`
1. List hidden files using `ls -a` and verify that there is a file called `.env.local.example`
1. Copy the example file using `cp .env.local.example .env.local`
1. Generate a value for NEXTAUTH_SECRET with `openssl rand -base64 32` and copy it into the `.env.local` file
1. Edit the `.env.local` file. Below is an example of what it should look like. Replace all values in <> with the appropriate values.
    ```ini
    NEXT_PUBLIC_VANTAGE_API_URL=http://<public_ip>:9000/api/v2
    # Auth is done via the API and therefore requires a URL that is accessible from the next.js backend
    VANTAGE_API_URL=http://localhost:9000/api/v2
    NEXT_PUBLIC_VANTAGE_WEBSOCKET_URL=ws://<public_ip>:9000/ws
    # Generate a value for NEXTAUTH_SECRET with openssl rand -base64 32
    NEXTAUTH_SECRET=<secret>
    NEXTAUTH_URL=http://<public_ip>:3000
    ```
1. Install dependencies using `npm install`
1. Build the frontend using `npm run build`

### Create service
1. Create a file called `vantage-frontend.service` in /etc/systemd/system/ with the following contents:
    ```ini
    [Unit]
    Description=Vantage frontend

    [Service]
    WorkingDirectory=/opt/vantage/vantage-frontend
    ExecStart=/snap/bin/npm run start
    User=vantage
    Type=exec
    Restart=on-failure
    RestartSec=10

    [Install]
    WantedBy=multi-user.target
    ```
1. Run `sudo systemctl daemon-reload`
1. Run `sudo systemctl enable vantage-frontend`
1. Run `sudo systemctl start vantage-frontend`
1. Run `sudo systemctl status vantage-frontend` to verify that the service is running

---

## NPM Generated Info
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!