import axios from "axios";

const isProduction = window.location.host.includes("appspot");

const instance = axios.create({
    baseURL: isProduction ? "https://docker-test-241719.appspot.com" : 'http://localhost:8080',
    timeout: 2000,
});

export default instance;
