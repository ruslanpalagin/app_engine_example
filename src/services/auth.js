const uuidv3 = require('uuid/v3');
const axios = require('axios');
const usersRepository = require('../repositories/usersRepository');

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
    // apiTokens: {},
    async isValidApiToken(apiToken){
        return !!(await usersRepository.findBy({ apiToken }));
    },
    // async getTokenInfo(apiToken) {
    //     return this.apiTokens[apiToken];
    // },
    // async createApiTokenold(googleResponse){
    //     const { accessToken } = googleResponse;
    //
    //     const isGoogleTokenValid = await getIsGoogleTokenValid({apiKey, accessToken});
    //     if (!isGoogleTokenValid) {
    //         return null;
    //     }
    //     const apiToken = uuidv3(JSON.stringify(googleResponse), uuidv3.URL);
    //     this.apiTokens[apiToken] = {
    //         googleResponse,
    //         apiToken,
    //     };
    //     return apiToken;
    // },
    async createApiToken(accessToken){
        let isGoogleTokenValid;

        try {
            isGoogleTokenValid = await getIsGoogleTokenValid({apiKey, accessToken});
        } catch (e) {
            console.log("error", e);
            return null;
        }
        if (!isGoogleTokenValid) {
            return null;
        }
        return uuidv3(JSON.stringify(accessToken) + "" + Math.random(), uuidv3.URL);
    },
};

module.exports = auth;
