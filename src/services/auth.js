const uuidv3 = require('uuid/v3');
const axios = require('axios');

const auth = {
    apiTokens: {},
    isValidApiToken(apiToken){
        return !!this.apiTokens[apiToken];
    },
    async getApiToken(googleAuthRequest){
        const { accessToken, googleId } = googleAuthRequest;
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
        };
        const response = await axios.get("https://www.googleapis.com/gmail/v1/users/me/profile?key=387313480807-ii6coqol8qmfi2bp9cg1rag5d62gtg7n.apps.googleusercontent.com", headers);
        console.log("response", response);
        const apiToken = uuidv3(JSON.stringify(googleAuthRequest), uuidv3.URL);
        this.apiTokens[apiToken] = {
            googleAuthRequest,
            apiToken,
        };
        return apiToken;
    },
};

module.exports = auth;
