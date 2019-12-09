import expect from "expect";
import rules from "./rules.js";

describe("rules", () => {
    describe("length rule", () => {
        it("should validate input with normal options", () => {
            const validationResult = rules.length("Lorem ipsum", [3, 20]);
            expect(validationResult).toEqual(null);
        });

        it("should return error message for long text", () => {
            const validationResult = rules.length("Lorem ipsum dolor sit amet", [3, 20]);
            expect(validationResult).toEqual("Maximum 20 symbols");
        });

        it("should return error message for empty input", () => {
            const validationResult = rules.length("", [3, 20]);
            expect(validationResult).toEqual("Minimum 3 symbols required");
        });

        it("should return error message for undefined input", () => {
            const validationResult = rules.length(undefined, [3, 20]);
            expect(validationResult).toEqual("Minimum 3 symbols required");
        });

        it("should return error message for numeric input", () => {
            const validationResult = rules.length(12, [3, 20]);
            expect(validationResult).toEqual("Minimum 3 symbols required");
        });
    });

    describe("isNumber rule", () => {
        it("should validate integer number", () => {
            const validationResult = rules.isNumeric("123456");
            expect(validationResult).toEqual(null);
        });

        it("should validate decimal number", () => {
            const validationResult = rules.isNumeric("123.456");
            expect(validationResult).toEqual(null);
        });

        it("should return error message for text", () => {
            const validationResult = rules.isNumeric("some text");
            expect(validationResult).toEqual("Should be a number");
        });

        it("should return error message for empty string", () => {
            const validationResult = rules.isNumeric("");
            expect(validationResult).toEqual("Should be a number");
        });
    });
});
