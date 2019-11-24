const storage = {
    key(name) {
        return `auth.v0.1.${name}`;
    },
    save(name, value) {
        localStorage.setItem(this.key(name), JSON.stringify(value));
    },
    load(name) {
        const key = this.key(name);
        const str = localStorage.getItem(key);
        let result = null;
        if (!str) {
            return result;
        }
        try {
            result = JSON.parse(str);
        } catch (e) {
            console.warn(`Cannot parse local storage value ${key}: ${str}`, e);
        }
        return result;
    },
};

const auth = {
    apiToken: storage.load("apiToken"),
    googleResponse: storage.load("googleResponse"),
    authenticate(apiToken, googleResponse) {
        this.apiToken = apiToken;
        this.googleResponse = apiToken ? googleResponse : null;
        storage.save("apiToken", apiToken);
        storage.save("googleResponse", googleResponse);
    },
    getUser() {
        return this.googleResponse;
    },
    isAuthenticated() {
        return !!this.apiToken;
    },
    getApiToken() {
        return this.apiToken;
    },
    logout() {
        this.apiToken = null;
        this.googleResponse = null;
        storage.save("apiToken", null);
        storage.save("googleResponse", null);
    },
};

export default auth;
