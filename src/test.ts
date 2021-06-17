const assert = require("assert");

const RouletteGameTest = require("./Roulette.ts");

describe("Simple test", () => {
  it("Check is result the same", () => {

    const game = new RouletteGameTest();

    game.start();

    const result1 = game.result();

    game.reset();

    game.start();

    const result2 = game.result();

    result1.forEach((item: number, index: number) =>
      assert.strictEqual(item, result2[index])
    );
  });

  it("Check if field too small", () => {

    const game = new RouletteGameTest(3);

    game.start();

    const result1 = game.result();

    result1.forEach((item: number, index: number) =>
      assert.strictEqual(item, 0)
    );
  });
});
