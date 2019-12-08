import expect from "expect";
import formValidator from "./index.js";

const formsWithRules = {
    simple: {
        form: {
            email: "email@example.com",
            password: "foobar",
        },
        rules: {
            email: ["required", "isEmail"],
            password: ["required"],
        }
    },
    simpleWithErrors: {
        form: {
            email: "email@example.com",
            password: "",
        },
        rules: {
            email: ["required", "isEmail"],
            password: ["required"]
        }
    },
    multiple: {
        form: {
            users: [ { name: "foo" }, { name: "bar" } ],
            orders: [
                { orderNumber: "123" },
                { orderNumber: "135" },
            ]
        },
        rules: {
            users: [formValidator.hasMany({ name: ["required"] })],
            orders: [formValidator.hasMany({ orderNumber: ["isNumeric"] })]
        }
    },
    multipleWithErrors: {
        form: {
            users: [ { name: "foo" }, { name: "" } ],
            orders: [
                { orderNumber: "123" },
                { orderNumber: "baz" },
            ]
        },
        rules: {
            users: [formValidator.hasMany({ name: ["required"] })],
            orders: [formValidator.hasMany({ orderNumber: ["isNumeric"] })]
        }
    }
};

describe("FormValidator", () => {
    describe("isValid method", () => {

        it("should return object without errors", () => {
            const form = formsWithRules.simple.form;
            const rules = formsWithRules.simple.rules;
            const expectedValidationObject = {
                isValid: true,
                errors: {},
                errorsArray: [],
            };

            const validationObject = formValidator.isValid(form, rules);

            expect(validationObject).toEqual(expectedValidationObject);
        });

        it("should return validation errors", () => {
            const form = formsWithRules.simpleWithErrors.form;
            const rules = formsWithRules.simpleWithErrors.rules;
            const expectedValidationObject = {
                errors: {
                    password: ["Required"],
                },
                errorsArray: [{
                    field: "password",
                    message: "Required"
                }],
                isValid: false
            };

            const validationObject = formValidator.isValid(form, rules);

            expect(validationObject).toEqual(expectedValidationObject);
        });

    });

    describe("hasMany method", () => {
        it("should validate multiple fields", () => {
            const form = formsWithRules.multiple.form;
            const rules = formsWithRules.multiple.rules;
            const expectedValidationObject = {
                isValid: true,
                errors: {},
                errorsArray: [],
            };

            const validationObject = formValidator.isValid(form, rules);

            expect(validationObject).toEqual(expectedValidationObject);
        });

        it("should validate multiple fields and return error", () => {
            const form = formsWithRules.multipleWithErrors.form;
            const rules = formsWithRules.multipleWithErrors.rules;
            const expectedValidationObject = {
                errors: {
                    "orders[1].orderNumber": [
                        "Should be a number"
                    ],
                    "users[1].name": [
                        "Required"
                    ]
                },
                errorsArray: [
                    {
                        "field": "users[1].name",
                        "message": "Required"
                    },
                    {
                        "field": "orders[1].orderNumber",
                        "message": "Should be a number"
                    }
                ],
                isValid: false
            };

            const validationObject = formValidator.isValid(form, rules);

            expect(validationObject).toEqual(expectedValidationObject);
        });
    });
});

