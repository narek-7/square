import { Component, HostListener } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  board = [];
  time: number = 0;
  steps: number = 0;
  score: number = 999;
  notStarted: string = '0';
  itsRunning: string = '1';
  itsOver: string = '2';
  gameStatus: string;
  paused: boolean = true;
  row = 4;
  column = 4;
  prompt: string = "Click the 'Start / Stop' button to start the game !!!";
  lines = [];
  emptyCellRow = undefined;
  emptyCellColumn = undefined;
  rating: string = '';

  ngOnInit() {
    this.gameStatus = this.notStarted;
    this.createRandomArray();
    this.lines = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 15],
      [12, 13, 14, undefined],
    ];
    this.arrayToMatrix();

    $(document).ready(function () {
      $('[data-toggle="popover"]').popover();
    });
  }

  createRandomArray() {
    let sortedArray = [];
    sortedArray[0] = undefined;
    for (let i = 1; i < this.row * this.column; i++) {
      sortedArray[i] = i;
    }
    for (let i = 0; i < this.row * this.column; i++) {
      let randIdx = Math.floor((this.row * this.column - i) * Math.random());
      this.board.push(sortedArray[randIdx]);
      sortedArray = sortedArray.filter((value, index) => {
        if (index != randIdx) {
          return value;
        }
      });
    }
  }

  arrayToMatrix() {
    for (let i = 0, k = 0; i < this.row; i++, k += this.column) {
      for (let j = 0; j < this.column; j++) {
        this.lines[i][j] = this.board[k + j];
        if (!this.lines[i][j]) {
          this.emptyCellRow = i;
          this.emptyCellColumn = j;
        }
      }
    }
  }

  @HostListener('window:keydown', ['$event']) keyEvent(ev) {
    if (ev.keyCode == '13') {
      this.StartPauseGame();
    }
    if (!this.paused) {
      if (ev.key == 'ArrowUp') {
        this.moveCellUp();
      }
      if (ev.key == 'ArrowDown') {
        this.moveCellDown();
      }
      if (ev.key == 'ArrowLeft') {
        this.moveCellLeft();
      }
      if (ev.key == 'ArrowRight') {
        this.moveCellRigtht();
      }
    }
  }

  onCellClick(row, column) {
    if (!this.paused) {
      if (row === this.emptyCellRow) {
        if (column - 1 === this.emptyCellColumn) {
          this.moveCellLeft();
        }
        if (column + 1 === this.emptyCellColumn) {
          this.moveCellRigtht();
        }
      }
      if (column === this.emptyCellColumn) {
        if (row - 1 === this.emptyCellRow) {
          this.moveCellUp();
        }
        if (row + 1 === this.emptyCellRow) {
          this.moveCellDown();
        }
      }
    }
  }

  moveCellUp() {
    if (this.emptyCellRow != this.row - 1) {
      this.lines[this.emptyCellRow][this.emptyCellColumn] =
        this.lines[this.emptyCellRow + 1][this.emptyCellColumn];
      this.lines[this.emptyCellRow + 1][this.emptyCellColumn] = undefined;
      this.emptyCellRow++;
      this.steps++;
      this.checkBoard();
    }
  }

  moveCellDown() {
    if (this.emptyCellRow != 0) {
      this.lines[this.emptyCellRow][this.emptyCellColumn] =
        this.lines[this.emptyCellRow - 1][this.emptyCellColumn];
      this.lines[this.emptyCellRow - 1][this.emptyCellColumn] = undefined;
      this.emptyCellRow--;
      this.steps++;
      this.checkBoard();
    }
  }

  moveCellRigtht() {
    if (this.emptyCellColumn != 0) {
      this.lines[this.emptyCellRow][this.emptyCellColumn] =
        this.lines[this.emptyCellRow][this.emptyCellColumn - 1];
      this.lines[this.emptyCellRow][this.emptyCellColumn - 1] = undefined;
      this.emptyCellColumn--;
      this.steps++;
      this.checkBoard();
    }
  }

  moveCellLeft() {
    if (this.emptyCellColumn != this.column - 1) {
      this.lines[this.emptyCellRow][this.emptyCellColumn] =
        this.lines[this.emptyCellRow][this.emptyCellColumn + 1];
      this.lines[this.emptyCellRow][this.emptyCellColumn + 1] = undefined;
      this.emptyCellColumn++;
      this.steps++;
      this.checkBoard();
    }
  }

  checkBoard() {
    let currentEl = 1;
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.column; j++) {
        if (this.lines[i][j]) {
          if (currentEl === this.lines[i][j]) {
            currentEl++;
          } else {
            return false;
          }
        }
      }
    }
    this.gameOver();
  }

  StartPauseGame() {
    if (this.gameStatus != this.itsOver) {
      this.paused = !this.paused;
      if (this.gameStatus === this.notStarted) {
        this.gameStatus = this.itsRunning;
        this.timer();
      }
    }
  }

  timer() {
    setInterval(() => {
      if (!this.paused) {
        this.time++;
        if (this.score > 1) {
          this.score = 999 - this.time * 0.5 - this.steps * 0.2;
        } else {
          this.score = 0;
        }
      }
    }, 1000);
  }

  gameOver() {
    if (this.score > 850) {
      this.rating = 'an incredible score';
    } else if (this.score > 700) {
      this.rating = 'a nice score';
    } else if (this.score > 550) {
      this.rating = 'a good score';
    } else if (this.score > 400) {
      this.rating = 'a middle score';
    } else {
      this.rating =
        'a bad score. Read the rules of the game to improve your score';
    }

    this.gameStatus = this.itsOver;
    this.paused = !this.paused;
    setTimeout(() => {
      $('#myModal').modal('show');
      $('#myModal').on('hide.bs.modal', () => {
        location.reload();
      });
    }, 500);
  }

  newGame() {
    location.reload();
  }
}
