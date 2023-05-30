/* @jest-environment jsdom */

const { readFileSync } = require("fs");
const { setupUi } = require("../src/ui");

const HTML = readFileSync("./public/index.html", "utf8");

function buildUi() {
    const doc = document.open("text/html", "replace");
    doc.write(HTML);
    doc.close();

    setupUi();
}

describe("app", () => {
    beforeEach(buildUi);

    function getEl(id) {
        return document.getElementById(id);
    }

    function setNumberOneInput(value) {
        getEl("number-one").value = value;
    }

    function setNumberTwoInput(value) {
        getEl("number-two").value = value;
    }

    function getResultText() {
        return getEl("result").textContent;
    }

    test("expect input elements to exist", () => {
        expect(getEl("number-one")).not.toBeNull();
        expect(getEl("number-two")).not.toBeNull();
    });

    test("expect operator buttons to exist", () => {
        expect(getEl("add")).not.toBeNull();
        expect(getEl("subtract")).not.toBeNull();
        expect(getEl("multiply")).not.toBeNull();
        expect(getEl("divide")).not.toBeNull();
    });

    test("result is empty by default", () => {
        const resultEl = getEl("result");
        expect(resultEl).not.toBeNull();
        expect(resultEl.textContent).toEqual("");
    });

    test("add with empty inputs", () => {
        getEl("add").click();
        expect(getResultText()).toEqual("0 + 0 = 0");
    });

    test("add: 3 + 4 = 7", () => {
        setNumberOneInput(3);
        setNumberTwoInput(4);
        getEl("add").click();
        expect(getResultText()).toEqual("3 + 4 = 7");
    });

    test("subtract: 12 - 8 = 4", () => {
        setNumberOneInput(12);
        setNumberTwoInput(8);
        getEl("subtract").click();
        expect(getResultText()).toEqual("12 - 8 = 4");
    });

    test("multiply: 3 * 4 = 12", () => {
        setNumberOneInput(3);
        setNumberTwoInput(4);
        getEl("multiply").click();
        expect(getResultText()).toEqual("3 * 4 = 12");
    });

    test("divide: 12 / 4 = 3", () => {
        setNumberOneInput(12);
        setNumberTwoInput(4);
        getEl("divide").click();
        expect(getResultText()).toEqual("12 / 4 = 3");
    });
});
