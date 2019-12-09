import rules from "./rules";

const formValidator = {
    /**
     * @return {{isValid: Boolean, errors: Object, errorsArray: Array}}
     * Example:
     *   const form = { email: 'email@com', password: 'foo' };
     *   const rules = { email: ['required', 'email'] };
     *   isValid(form, rules);
     */
    isValid(formData, rules) {
        let errorsArray = [];
        Object.keys(rules).forEach((field) => {
            const { isValid, errors } = this.isValidField(field, formData, rules[field]);
            if (!isValid) {
                errorsArray = errorsArray.concat(errors);
            }
        });
        const errors = {};
        errorsArray.forEach(({ field, message }) => {
            errors[field] = errors[field] || [];
            errors[field].push(message);
        });
        return { isValid: errorsArray.length === 0, errors, errorsArray };
    },

    /**
     * @return {{isValid: boolean, errors: Array}}
     * Example:
     *   const form = { email: 'email@com', password: 'foo' };
     *   isValidField('email', form, ['required', 'email']);
     */
    isValidField(field, formData, fieldRules = []) {
        let errors = [];
        for (let i = 0; i < fieldRules.length; i += 1) {
            const rule = fieldRules[i];
            const { validator, options } = this.extractValidator(rule);
            const validationResult = validator(formData[field], options, formData, field);
            if (validationResult !== null) {
                if (typeof validationResult === "string") {
                    errors.push({ field, message: validationResult });
                }
                if (Array.isArray(validationResult)) {
                    errors = errors.concat(validationResult);
                }
            }
        }
        return { isValid: errors.length === 0, errors };
    },

    extractValidator(rule) {
        if (typeof rule === "function") {
            return { validator: rule, options: {} };
        }
        if (typeof rule === "string") {
            const options = rule.split(":");
            const name = options.shift();
            const validator = rules[name];
            return { validator, options };
        }
        return null;
    },

    /**
     * Example:
     *   const form = { users: [ { name: "foo" }, { name: "" } ] };
     *   const rules = { users: [formValidator.hasMany({ name: ["required"] })] };
     *   formValidator.isValid(form, rules);
     *   // => errors: [{ field: "users[1].name", message: "Required" }]
     */
    hasMany(rules) {
        return (value, options, attributes, fieldName) => {
            const resources = value;
            let allErrors = [];
            for (let i = 0; i < resources.length; i += 1) {
                const resource = resources[i];
                const { errorsArray = [] } = this.isValid(resource, rules);
                for (let j = 0; j < errorsArray.length; j += 1) {
                    errorsArray[j].field = `${fieldName}[${i}].${errorsArray[j].field}`;
                }
                allErrors = allErrors.concat(errorsArray);
            }
            return allErrors;
        };
    },

    isBulkObjectResultsValid(collectionOfErrorResults) {
        for (let i in collectionOfErrorResults) {
            if (this.isObjectHasErrors(collectionOfErrorResults[i])) {
                return {
                    isValid: false,
                };
            }
        }
        return {
            isValid: true,
        };
    },

    isObjectHasErrors(object) {
        for (let i in object) {
            if (object[i] && "length" in object[i] && object[i].length > 0) {
                return true;
            }
        }
        return false;
    },

    getTouchedFromSchema(schema) {
        const touched = {...schema};
        Object.keys(touched).forEach(key => touched[key] = true);
        return touched;
    },
};

export default formValidator;