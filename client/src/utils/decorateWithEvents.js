const decorateWithEvents = (classs) => {
    const decoratedObject = classs.prototype || classs;

    decoratedObject.on = function (name, callback) {
        this.callbacks = this.callbacks || {};
        this.callbacks[name] = this.callbacks[name] || [];
        this.callbacks[name].push(callback);
    };

    decoratedObject.emit = function (name, data) {
        this.callbacks = this.callbacks || {};
        if (!this.callbacks[name]) {
            return;
        }

        /* eslint-disable no-restricted-syntax */
        for (const i in this.callbacks[name]) {
            if (Object.prototype.hasOwnProperty.call(this.callbacks[name], i)) {
                this.callbacks[name][i](data);
            }
        }
    };

    decoratedObject.off = function (name, callback) {
        this.callbacks = this.callbacks || {};
        this.callbacks[name] = this.callbacks[name] || [];
        const index = this.callbacks[name].indexOf(callback);
        this.callbacks[name].splice(index, 1);
    };

    return classs;
};

export default decorateWithEvents;
