import axios from "axios";
import auth from "./auth";

const isProduction = window.location.host.includes("appspot");

const instance = axios.create({
    baseURL: isProduction ? "https://docker-test-241719.appspot.com" : 'http://localhost:8080',
    timeout: 2000,
});

instance.interceptors.request.use(function (config) {
    config.headers.token = auth.getApiToken();
    return config;
}, function (error) {
    alert("API ERROR: " + JSON.stringify(error));
    return Promise.reject(error);
});

export default instance;
