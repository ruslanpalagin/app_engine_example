
module.exports = {
    plugins: [
        new webpack.NormalModuleReplacementPlugin(/element-react[\/\\]src[\/\\]locale[\/\\]lang[\/\\]zh-CN/, 'element-react/src/locale/lang/en')
    ]
};
