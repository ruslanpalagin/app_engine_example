import {
    isEmpty,
    isAlphanumeric,
    isPostalCode,
    isNumeric,
    isDecimal,
    isEmail
} from "validator";

export default {
    required: (value = "") => (!isEmpty(value) ? null : "Required"),
    isEmpty: (value = "") => (!isEmpty(value) ? null : "Cannot be left empty"),
    isAlphanumeric: (value = "") => (isAlphanumeric(value.replace(/ /g, "")) ? null : "Invalid"),
    isPostalCode: (value = "") => (isPostalCode(value, "any") ? null : "Invalid"),
    isEmail: (value = "") => (isEmail(value) ? null : "Invalid email address"),
    isNumeric: (value = "") => (isNumeric(value) ? null : "Should be a number"),
    isNumber: (value = "") => {
        const isValid = isNumeric(value) || isDecimal(value);
        return isValid ? null : "Should be a number";
    },
    length: (value = "", options) => {
        const [min, max] = options;
        const { length } = value;
        if (min !== undefined && length < parseInt(min, 10) || length === undefined ) {
            return `Minimum ${min} symbols required`;
        }
        if (max !== undefined && length > parseInt(max, 10)) {
            return `Maximum ${max} symbols`;
        }
        return null;
    },
};