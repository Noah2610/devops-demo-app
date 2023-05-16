const { add, subtract, multiply, divide } = require("../src/calc");

describe("calc", () => {
    test("add: 2 + 3 = 5", () => {
        const result = add(2, 3);
        expect(result).toEqual(5);
    });

    test("subtract: 8 - 3 = 5", () => {
        const result = subtract(8, 3);
        expect(result).toEqual(5);
    });

    test("multiply: 6 * 5 = 30", () => {
        const result = multiply(6, 5);
        expect(result).toEqual(30);
    });

    test("divide: 12 / 4 = 3", () => {
        const result = divide(12, 4);
        expect(result).toEqual(3);
    });
});
