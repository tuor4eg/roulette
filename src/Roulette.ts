const Settings = require("./settings.ts");

class Roulette {
  settings = new Settings();

  rows: number;
  skew: Array<number>;
  turns: number;
  wins: number;
  gameField: Array<any>;

  constructor(rows: number = 4) {
    //this.settings = new Settings();
    this.gameField = [];
    this.rows = rows;
    this.skew = new Array(this.settings.tapes.length).fill(0);
    this.turns = 0;
    this.wins = 0;
  }

  checkPayout() {
    this.settings.lines.forEach((line: Array<number>) => {
      //console.log(line)
      const resultLine = line.map((num, index) => {
        const row = this.gameField[num];
        const value = row[index];

        return value;
      });

      let counter = 0;
      const num = resultLine[0];

      for (const seq of resultLine) {
        if (seq === num) counter += 1;
        else break;
      }

      const payout = this.settings.payout.get(num).prizes[counter - 1];

      //console.log(checker, payout)

      if (payout && payout > 0) {
        console.log(line);
        console.log(this.gameField);
        console.log(counter, payout);
        this.wins += 1;
      }
    });
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

  start() {
    const tapeLength = this.settings.tapes[0].length - this.rows;
    const fieldWidth = this.skew.length;

    let i = 0;

    while (this.skew[fieldWidth - 1] <= tapeLength) {
      i++;
      //console.log(this.skew);
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

    console.log(this.turns, this.wins);
  }
}

module.exports = Roulette;
