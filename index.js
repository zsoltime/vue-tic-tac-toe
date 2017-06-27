function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function declareWinner(cells) {
  const winningCells = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < winningCells.length; i++) {
    const [a, b, c] = winningCells[i];
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return cells[a];
    }
  }
  return null;
}

const game = new Vue({
  el: '#app',
  data: {
    cells: Array(9).fill(null),
    points: {
      x: 0,
      o: 0,
    },
    xIsNext: true,
    xIsPlayer: true,
    status: 'Start game',
    gameover: false,
  },
  beforeUpdate: function() {
    const winner = declareWinner(this.cells);
    console.log(winner);
    if (winner && !this.gameover) {
      this.points[winner] += 1;
      this.gameover = true;
      // this delay makes screen readers read "next round" after announcing winner
      setTimeout(() => this.$refs.startBtn.focus(), 10);
    }
    this.status = this.getStatus(this.cells, winner);
  },
  mounted: function() {
    document.querySelectorAll('.board__cell')[4].focus();
  },
  methods: {
    mark: function(i) {
      const cells = this.cells.slice();
      if (declareWinner(cells) || cells[i]) {
        return;
      }
      cells[i] = this.xIsNext ? 'x' : 'o';
      this.cells = cells;
      this.xIsNext = !this.xIsNext;
    },
    start: function() {
      this.cells = Array(9).fill(null);
      this.xIsNext = true;
      this.gameover = false;
    },
    getStatus: function(cells, winner) {
      let status;
      const markedCells = cells.filter(x => x).length;

      if (markedCells === 0) {
        status = 'Start game';
      } else if (winner) {
        status = `Game over! Winner: ${winner}`;
      } else if(!winner && markedCells === 9) {
        status = 'Gamer over! Draw';
      } else {
        status = (this.xIsNext ? 'X' : 'O') + ' Turn';
      }
      return status;
    },
    aiMove: function() {
      const emptyCells = this.cells.reduce((empty, current, i) => {
        return current ? empty : [...empty, i];
      }, []);
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      if (emptyCells.length) {
        this.mark(randomCell);
      }
    }
  },
  computed: {
    buttonText: function() {
      return this.gameover ? 'Next Round' : 'Restart Game';
    },
  },
  watch: {
    xIsNext: function(isX, isO) {
      if ((this.xIsPlayer && isO) || (!this.xIsPlayer && isX)) {
        setTimeout(this.aiMove, random(100, 1200));
      }
    },
  },
});
