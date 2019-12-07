const storage = {
    key(name) {
        return `auth.v0.2.${name}`;
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
    user: storage.load("user"),
    authenticate(apiToken = null, user = null) {
        this.apiToken = apiToken;
        this.user = apiToken ? user : null;
        storage.save("apiToken", apiToken);
        storage.save("user", user);
    },
    getUser() {
        return this.user;
    },
    isAuthenticated() {
        return !!this.apiToken;
    },
    getApiToken() {
        return this.apiToken;
    },
    logout() {
        this.apiToken = null;
        this.user = null;
        storage.save("apiToken", null);
        storage.save("user", null);
    },
};

export default auth;
