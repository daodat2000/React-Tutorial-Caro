import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import { Button, Header, Image, Dropdown, Divider } from 'semantic-ui-react';
import { Container } from 'semantic-ui-react';

function Square(props) {
  return (
    <Button
      basic
      className='square'
      onClick={props.onClick}
      color={props.winningSquare ? 'red' : null}
    >
      {props.value}
    </Button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
        winningSquare={
          this.props.winner && this.props.winner.winningSquares.includes(i)
        }
      />
    );
  }
  render() {
    var board = [];
    for (var i = 0; i < this.props.sizeBoard; i++) {
      var row = [];
      for (var j = 0; j < this.props.sizeBoard; j++) {
        row.push(this.renderSquare(i * this.props.sizeBoard + j));
      }
      board.push(
        <div className='board-row' key={i}>
          {row}
        </div>
      );
    }

    return <div>{board}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(225).fill(null),
          location: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      ascending: false,
      sizeBoard: 10,
    };
  }

  handleChangeSizeBoard = (e, { value }) =>
    this.setState({
      history: [
        {
          squares: Array(100).fill(null),
          location: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      ascending: false,
      sizeBoard: value,
    });

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares, this.state.sizeBoard) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: i,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const currentHistory = this.state.stepNumber;
    const winner = calculateWinner(current.squares, this.state.sizeBoard);
    const moves = this.state.ascending
      ? history.map((step, move) => {
          const col = step.location % this.state.sizeBoard;
          const row = parseInt(step.location / this.state.sizeBoard);
          const desc = move
            ? 'Move #' + move + ` (${col}, ${row})`
            : 'Go to game start';
          return (
            <li key={move}>
              <Button
                basic
                size='small'
                onClick={() => this.jumpTo(move)}
                active={currentHistory === move ? true : false}
                style={
                  currentHistory === move
                    ? { fontWeight: 'bold' }
                    : { fontWeight: 'normal' }
                }
              >
                {desc}
              </Button>
            </li>
          );
        })
      : history
          .slice()
          .reverse()
          .map((step, move) => {
            move = history.length - move - 1;
            const col = step.location % this.state.sizeBoard;
            const row = parseInt(step.location / this.state.sizeBoard);
            const desc = move
              ? 'Move #' + move + ` (${col}, ${row})`
              : 'Go to game start';
            return (
              <li key={move}>
                <Button
                  basic
                  size='small'
                  onClick={() => this.jumpTo(move)}
                  active={currentHistory === move ? true : false}
                  style={
                    currentHistory === move
                      ? { fontWeight: 'bold' }
                      : { fontWeight: 'normal' }
                  }
                >
                  {desc}
                </Button>
              </li>
            );
          });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;
    } else {
      if (
        this.state.stepNumber ===
        this.state.sizeBoard * this.state.sizeBoard
      ) {
        status = 'Draw';
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }
    const options = [
      { key: 1, text: '5 x 5', value: 5 },
      { key: 2, text: '7 x 7', value: 7 },
      { key: 3, text: '10 x 10', value: 10 },
      { key: 4, text: '12 x 12', value: 12 },
      { key: 5, text: '15 x 15', value: 15 },
    ];
    return (
      <Container>
        <Header as='h2' color='teal' className='center'>
          <Image src='/icon-caro.jpg' /> Caro-Game
        </Header>
        <Header as='h4' color='teal' textAlign='center'>
          Choose size of board
        </Header>
        <div className='center'>
          <Dropdown
            onChange={this.handleChangeSizeBoard}
            options={options}
            defaultValue={options[2].value}
            selection
          />
        </div>
        <Divider section />
        <div className='game'>
          <div className='game-board'>
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              winner={winner}
              sizeBoard={this.state.sizeBoard}
            />
          </div>
          <div className='game-info'>
            <div>{status}</div>
            Sort:{' '}
            <Button
              basic
              onClick={() =>
                this.setState({
                  ascending: !this.state.ascending,
                })
              }
            >
              {this.state.ascending ? 'ascending' : 'descending'}
            </Button>
            <ol>{moves}</ol>
          </div>
        </div>
      </Container>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

function calculateWinner(squares, sizeBoard) {
  console.log(sizeBoard);

  for (let i = 0; i < sizeBoard; i++) {
    for (let j = 0; j < sizeBoard; j++) {
      if (
        j < sizeBoard - 4 &&
        squares[i * sizeBoard + j] &&
        squares[i * sizeBoard + j] === squares[i * sizeBoard + j + 1] &&
        squares[i * sizeBoard + j] === squares[i * sizeBoard + j + 2] &&
        squares[i * sizeBoard + j] === squares[i * sizeBoard + j + 3] &&
        squares[i * sizeBoard + j] === squares[i * sizeBoard + j + 4]
      ) {
        return {
          winner: squares[i * sizeBoard + j],
          winningSquares: [
            i * sizeBoard + j,
            i * sizeBoard + j + 1,
            i * sizeBoard + j + 2,
            i * sizeBoard + j + 3,
            i * sizeBoard + j + 4,
          ],
        };
      }
      if (
        i < sizeBoard - 4 &&
        squares[i * sizeBoard + j] &&
        squares[i * sizeBoard + j] === squares[(i + 1) * sizeBoard + j] &&
        squares[i * sizeBoard + j] === squares[(i + 2) * sizeBoard + j] &&
        squares[i * sizeBoard + j] === squares[(i + 3) * sizeBoard + j] &&
        squares[i * sizeBoard + j] === squares[(i + 4) * sizeBoard + j]
      ) {
        return {
          winner: squares[i * sizeBoard + j],
          winningSquares: [
            i * sizeBoard + j,
            (i + 1) * sizeBoard + j,
            (i + 2) * sizeBoard + j,
            (i + 3) * sizeBoard + j,
            (i + 4) * sizeBoard + j,
          ],
        };
      }
      if (
        i < sizeBoard - 4 &&
        j < sizeBoard - 4 &&
        squares[i * sizeBoard + j] &&
        squares[i * sizeBoard + j] === squares[(i + 1) * sizeBoard + j + 1] &&
        squares[i * sizeBoard + j] === squares[(i + 2) * sizeBoard + j + 2] &&
        squares[i * sizeBoard + j] === squares[(i + 3) * sizeBoard + j + 3] &&
        squares[i * sizeBoard + j] === squares[(i + 4) * sizeBoard + j + 4]
      ) {
        return {
          winner: squares[i * sizeBoard + j],
          winningSquares: [
            i * sizeBoard + j,
            (i + 1) * sizeBoard + j + 1,
            (i + 2) * sizeBoard + j + 2,
            (i + 3) * sizeBoard + j + 3,
            (i + 4) * sizeBoard + j + 4,
          ],
        };
      }
      if (
        i >= 4 &&
        j < sizeBoard - 4 &&
        squares[i * sizeBoard + j] &&
        squares[i * sizeBoard + j] === squares[(i - 1) * sizeBoard + j + 1] &&
        squares[i * sizeBoard + j] === squares[(i - 2) * sizeBoard + j + 2] &&
        squares[i * sizeBoard + j] === squares[(i - 3) * sizeBoard + j + 3] &&
        squares[i * sizeBoard + j] === squares[(i - 4) * sizeBoard + j + 4]
      ) {
        return {
          winner: squares[i * sizeBoard + j],
          winningSquares: [
            i * sizeBoard + j,
            (i - 1) * sizeBoard + j + 1,
            (i - 2) * sizeBoard + j + 2,
            (i - 3) * sizeBoard + j + 3,
            (i - 4) * sizeBoard + j + 4,
          ],
        };
      }
    }
  }
  return null;
}
