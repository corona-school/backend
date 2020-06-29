import * as assert from "assert";

describe("The class 'name'", function () {
    beforeEach(function() {
        // Class Init
        console.log("Start");
    });

    afterEach(function() {
        // Clean up
        console.log("End");
    });

    describe("The method 'name", function() {
        beforeEach(function() {
            // Method Init
            console.log("Start");
        });

        afterEach(function() {
            // Clean up
            console.log("End");
        });

        it("Executes a test", function() {
            // Arrange
            // Act
            // Assert
            assert.strictEqual(true, true, "Some message");
        });
    });
});
