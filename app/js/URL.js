// const HOST = "localhost";
const HOST = "127.0.0.1";
const HOST_PROD = "www.production.com";
const PORT = 8000;
const SCHEME = "http";
const prod = false;

const URL_SERVER = !prod ? `${SCHEME}://${HOST}:${PORT}` : `${SCHEME}://${HOST_PROD}`;