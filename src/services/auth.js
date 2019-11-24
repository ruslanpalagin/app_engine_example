const uuidv3 = require('uuid/v3');
const axios = require('axios');

const getIsGoogleTokenValid = async ({apiKey, accessToken}) => {
    const url = `https://content.googleapis.com/gmail/v1/users/me/labels?key=${apiKey}`; // &access_token=${accessToken}
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
    };
    const response = await axios.get(url, {headers});
    return response.data.labels && response.data.labels.length > 0;
};

const apiKey = "AIzaSyD9VMwM0Iw0Nw_ymQKqEvACdAqWKPWq1is";

const auth = {
    apiTokens: {},
    isValidApiToken(apiToken){
        return !!this.apiTokens[apiToken];
    },
    async getApiToken(googleAuthRequest){
        const { accessToken } = googleAuthRequest;

        const isGoogleTokenValid = await getIsGoogleTokenValid({apiKey, accessToken});
        if (!isGoogleTokenValid) {
            return null;
        }
        const apiToken = uuidv3(JSON.stringify(googleAuthRequest), uuidv3.URL);
        this.apiTokens[apiToken] = {
            googleAuthRequest,
            apiToken,
        };
        return apiToken;
    },
};

module.exports = auth;
