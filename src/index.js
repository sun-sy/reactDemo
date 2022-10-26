/*
* @Author: Do not edit
* @Date: 2022-10-26 18:40:01
 * @LastEditors: sun
 * @LastEditTime: 2022-10-26 23:38:32
 * @FilePath: /demo/src/index.js
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button
      className='square'
      onClick={props.onClick}
    >{props.value}</button>
  )
}
// class Square extends React.Component {
//   render() {
//     return (
//       <button
//         className="square"
//         onClick={() => this.props.onClick()} >
//         {this.props.value}
//       </button>
//     );
//   }
// }

class Board extends React.Component {
  renderSquare(i) {
    return (<Square
      key={i}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />);
  }
  handlerClick(i) {
    const squares = this.props.squares.slice();
    if (!squares[i] && !calculateWinner(this.props.squares)) {
      squares[i] = this.props.xIsNext ? 'X' : 'O';
      this.setState({
        squares,
        xIsNext: !this.state.xIsNext,
      });
    };
  };

  render() {
    return (
      <div>
        {Array(3).fill(null).map((item, index) => {
          return (
            <div
              className='board-row'
              key={`row${index}`}
            >{Array(3).fill(null).map((sub, i) => {
              return (
                this.renderSquare(index + (index ? Math.pow(2, index) : 0) + i)
              )
            })}</div>
          );
        })}
        {/* <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div> */}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        xIsNext: true,
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.slice(0, history.length - 1).map((step, move) => {
      const desc = move ? `Go to move #${move}` : 'Go to start';
      return (
        <li
          key={move}>
          <button
            onClick={() => { this.jumpTo(move) }}>{desc}</button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = `Winner:${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handlerClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
  handlerClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: this.state.history[step].xIsNext,
    });
  }
}
// 获胜规则
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
