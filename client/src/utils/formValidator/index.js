import rules from "./rules";

const formValidator = {
    /**
     * @return {{isValid: Boolean, errors: Object, errorsArray: Array}}
     * Example:
     *   const form = { email: 'email@com', password: 'foo' };
     *   const rulesProps = { email: rules: ['required', 'email'], customMessage: 'error'(optional)};
     *   isValid(form, rulesProps);
     */
    isValid(formData, rulesProps) {
        let errorsArray = [];
        let errorsMessagesArrays = [];

        Object.keys(rulesProps).forEach((field) => {
            const { isValid, errors, errorsMessagesArray } = this.isValidField(field, formData, rulesProps);

            if (!isValid) {
                errorsArray = errorsArray.concat(errors);
                errorsMessagesArrays = errorsMessagesArrays.concat(errorsMessagesArray);
            }
        });

        const fieldsErrors = {};
        errorsArray.forEach(({ field, message }) => {
            fieldsErrors[field] = fieldsErrors[field] || [];
            fieldsErrors[field].push(message);
        });

        const errorsMessages = {};
        errorsMessagesArrays.forEach(({ field, message }) => {
            errorsMessages[field] = errorsMessages[field] || [];
            errorsMessages[field].push(message);
        });

        return { isValid: errorsArray.length === 0, fieldsErrors, errorsArray, errorsMessages };
    },

    /**
     * @return {{isValid: boolean, errors: Array}}
     * Example:
     *   const form = { email: 'email@com', password: 'foo' };
     *   isValidField('email', form, rulesProps);
     */
    isValidField(field, formData, rulesProps) {
        const fieldRules = rulesProps[field].rules || [];

        let errors = [];
        let errorsMessagesArray = [];
        for (let i = 0; i < fieldRules.length; i += 1) {
            const rule = fieldRules[i];
            const { validator, options } = this.extractValidator(rule);
            const validationResult = validator(formData[field], options, formData, field);
            if (validationResult !== null) {
                if (rulesProps[field].customMessage) {
                    const errorsMessage = { field, message: rulesProps[field].customMessage };

                    if ( ! this._fieldKeyExist(errorsMessagesArray, field)) {
                        errorsMessagesArray.push(errorsMessage);
                    }
                } else {
                    if (typeof validationResult === "string") {
                        errorsMessagesArray.push({ field, message: validationResult });
                    }
                    if (Array.isArray(validationResult)) {
                        errorsMessagesArray = errorsMessagesArray.concat(validationResult);
                    }
                }
                
                if (typeof validationResult === "string") {
                    errors.push({ field, message: validationResult });
                }
                if (Array.isArray(validationResult)) {
                    errors = errors.concat(validationResult);
                }
            }
        }

        return { isValid: errors.length === 0, errors, errorsMessagesArray };
    },

    _fieldKeyExist(errorsMessagesArray, fieldName) {
        let result = false;
        for (let j = (errorsMessagesArray.length-1); j >= 0; j--) {
            if (errorsMessagesArray[j].field === fieldName) {
                result = true;
                
                break;
            }
        }

        return result;
    },

    extractValidator(rule) {
        if (typeof rule === "string") {
            const options = rule.split(":");
            const name = options.shift();
            const validator = rules[name];
            return { validator, options };
        }
        return null;
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