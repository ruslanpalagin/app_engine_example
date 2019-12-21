const url = {
    publicDir(file) {
        return process.env.PUBLIC_URL + file;
    },
};

export default url;