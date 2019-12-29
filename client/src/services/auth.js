import decorateWithEvents from '../utils/decorateWithEvents';

const storage = {
    namespace: "auth.v0.2",
    key(name) {
        return `${this.namespace}.${name}`;
    },
    save(name, value) {
        setTimeout(() => this.saveSync(name, value), 1);
    },
    saveSync(name, value) {
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

const auth = decorateWithEvents({
    CHANGE: "change",
    apiToken: storage.load("apiToken"),
    user: storage.load("user"),
    authenticate(apiToken = null, user = null) {
        this.apiToken = apiToken;
        this.user = apiToken ? user : null;
        this.emit(this.CHANGE, this.getState());
        storage.save("apiToken", apiToken);
        storage.save("user", user);
    },
    getUser() {
        return this.user;
    },
    getApiToken() {
        return this.apiToken;
    },
    logout() {
        this.apiToken = null;
        this.user = null;
        this.emit(this.CHANGE, this.getState());
        storage.save("apiToken", null);
        storage.save("user", null);
    },
    getState(){
        return { user: this.user, apiToken: this.apiToken };
    },
    getGoogleAccountNumber(){
        try {
            return this.user.googleResponse.Zi.session_state.extraQueryParams.authuser;
        } catch (e) {
            console.warn(e);
        }
    },
});

export default auth;
