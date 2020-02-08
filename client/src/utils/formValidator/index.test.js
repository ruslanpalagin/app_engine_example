import expect from "expect";
import formValidator from "./index.js";

const formsWithRules = {
    simple: {
        form: {
            email: "email@example.com",
            password: "foobar",
        },
        rulesProps: {
            email: {
                rules: ["required", "isEmail"],
            },
            password: {
                rules: ["required"]
            },
        }
    },
    simpleWithErrors: {
        form: {
            email: "email@example.com",
            password: "",
        },
        rulesProps: {
            email: {
                rules: ["required", "isEmail"],
            },
            password: {
                rules: ["required"]
            },
        }
    },
    simpleWithCustomMessages: {
        form: {
            email: "email@example.com",
            password: "foobar",
        },
        rulesProps: {
            email: {
                rules: ["required", "isEmail"],
                customMessage: 'Please enter the email',
            },
            password: {
                rules: ["required"],
                customMessage: 'Please enter the password',
            },
        }
    },
    simpleWithCustomMessagesWithErrors: {
        form: {
            email: "",
            password: "",
        },
        rulesProps: {
            email: {
                rules: ["required", "isEmail"],
                customMessage: 'Please enter the email',
            },
            password: {
                rules: ["length:2"],
                customMessage: 'Please enter the password',
            },
        }
    },
};

describe("FormValidator", () => {
    describe("isValid method", () => {

        it("should return object without fieldsErrors", () => {
            const form = formsWithRules.simple.form;
            const rulesProps = formsWithRules.simple.rulesProps;
            const expectedValidationObject = {
                isValid: true,
                fieldsErrors: {},
                errorsMessages: {},
                errorsArray: [],
            };

            const validationObject = formValidator.isValid(form, rulesProps);

            expect(validationObject).toEqual(expectedValidationObject);
        });

        it("should return validation fieldsErrors", () => {
            const form = formsWithRules.simpleWithErrors.form;
            const rulesProps = formsWithRules.simpleWithErrors.rulesProps;
            const expectedValidationObject = {
                errorsMessages: {
                    password: ["Required"],
                },
                fieldsErrors: {
                    password: ["Required"],
                },
                errorsArray: [{
                    field: "password",
                    message: "Required"
                }],
                isValid: false
            };

            const validationObject = formValidator.isValid(form, rulesProps);

            expect(validationObject).toEqual(expectedValidationObject);
        });

        it("should return object without fieldsErrors", () => {
            const form = formsWithRules.simpleWithCustomMessages.form;
            const rulesProps = formsWithRules.simpleWithCustomMessages.rulesProps;
            const expectedValidationObject = {
                isValid: true,
                fieldsErrors: {},
                errorsMessages: {},
                errorsArray: [],
            };

            const validationObject = formValidator.isValid(form, rulesProps);

            expect(validationObject).toEqual(expectedValidationObject);
        });

        it("should return validation fieldsErrors", () => {
            const form = formsWithRules.simpleWithCustomMessagesWithErrors.form;
            const rulesProps = formsWithRules.simpleWithCustomMessagesWithErrors.rulesProps;
            const expectedValidationObject = {
                errorsMessages: {
                    email: ["Please enter the email"],
                    password: ["Please enter the password"],
                },
                fieldsErrors: {
                    email: ["Required", "Invalid email address"],
                    password: ["Minimum 2 symbols required"],
                },
                errorsArray: [
                    {
                        field: "email",
                        message: "Required",
                    },
                    {
                        field: "email",
                        message: "Invalid email address",
                    },
                    {
                        field: "password",
                        message: "Minimum 2 symbols required",
                    },
                ],
                isValid: false
            };
            
            const validationObject = formValidator.isValid(form, rulesProps);

            expect(validationObject).toEqual(expectedValidationObject);
        });
    });
});

