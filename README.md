# FinTwin

The frontend is connected to the Express backend at `http://localhost:3000`.

## Run on the development machine

1. Copy `Backend/.env.example` to `Backend/.env` and set `MONGO_URL` and `JWT_SECRET`.
2. Install backend packages with `npm install` from `Backend`.
3. Start MongoDB, then start the backend with `npm start` from `Backend`.
4. Serve the `Frontend` folder with a static web server (do not open the HTML files directly). The API URL is set in `Frontend/api.js`.

The `.env` file is ignored by Git; do not commit credentials.
