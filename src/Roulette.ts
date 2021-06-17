const Settings = require("./settings.ts");

class Roulette {
  settings = new Settings();

  rows: number;
  skew: Array<number>;
  turns: number;
  wins: number;
  gameField: Array<any>;

  constructor(rows: number = 4) {
    this.gameField = [];
    this.rows = rows;
    this.skew = new Array(this.settings.tapes.length).fill(0);
    this.turns = 0;
    this.wins = 0;
  }

  lineChecker(line: Array<number>, num: number) {
    let counter = 0;

    for (const seq of line) {
      if (seq === num || seq === 8) counter += 1;
      else break;
    }

    return counter;
  }

  checkPayout() {
    const payouts: Array<number> = [];

    this.settings.lines.forEach((line: Array<number>) => {
      const resultLine = line.map((num, index) => {
        const row = this.gameField[num];
        const value = row[index];

        return value;
      });

      const firstNum = resultLine[0];

      const counterNum = this.lineChecker(resultLine, firstNum);
      const counter8 = this.lineChecker(resultLine, 8);

      const payout = this.settings.payout.get(firstNum).prizes[counterNum - 1];
      const payout8 =
        counter8 > 0 ? this.settings.payout.get(8).prizes[counter8 - 1] : 0;

      const reverseLine = resultLine.reverse();
      const firstNumRev = reverseLine[0];

      const counterNumRev = this.lineChecker(reverseLine, firstNumRev);
      const counter8rev = this.lineChecker(reverseLine, 8);

      const payoutRev =
        this.settings.payout.get(firstNumRev).prizes[counterNumRev - 1];
      const payout8rev =
        counter8rev > 0
          ? this.settings.payout.get(8).prizes[counter8rev - 1]
          : 0;

      const maxPayout = [payout, payout8, payoutRev, payout8rev].sort()[3];

      if (maxPayout > 0) {
        payouts.push(maxPayout);
      }
    });

    if (payouts.length > 0) {
      const maxLinePayout = payouts.sort()[payouts.length - 1];

      if (maxLinePayout > 0) this.wins += 1;
    }
  }

  turn() {
    this.gameField = [];

    for (let i = 0; i < this.rows; i++) {
      const row = this.settings.tapes.map(
        (tape: Array<number>, index: number) => tape[i + this.skew[index]]
      );
      this.gameField.push(row);
    }

    this.turns += 1;
  }

  checkLines() {
    return this.settings.lines.every((line: Array<number>) =>
      line.every((item: number) => item <= this.rows - 1)
    );
  }

  start() {
    if (!this.checkLines()) {
      console.log(`Размер поля слишком мал!`);
      return;
    }

    console.log(`Игра началась`);

    const tapeLength = this.settings.tapes[0].length - this.rows;
    const fieldWidth = this.skew.length;

    let i = 0;

    while (this.skew[fieldWidth - 1] <= tapeLength) {
      i++;

      this.turn();
      this.checkPayout();

      this.skew[0]++;

      for (let i = 0; i < fieldWidth - 1; i++) {
        if (this.skew[i] > tapeLength) {
          this.skew[i] = 0;

          this.skew[i + 1]++;
        }
      }
    }

    console.log(`Игра завершена\n`);
  }

  result() {
    if (this.turns === 0) {
      console.log("Сперва начните игру!");
    }
    else {
      console.log(`Всего комбинаций: ${this.turns}`);
      console.log(`Выигрышных комбинаций: ${this.wins}`);
      console.log(`Проигрышных комбинаций: ${this.turns - this.wins}`);
    }

    return [this.turns, this.wins];
  }

  reset() {
    this.gameField = [];
    this.skew = new Array(this.settings.tapes.length).fill(0);
    this.turns = 0;
    this.wins = 0;
  }
}

module.exports = Roulette;
