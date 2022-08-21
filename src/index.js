import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './button.css';

function Square(props) {
    return (
        <button
            className={props.isSelected ? "square squareSelected" : "square"}
            onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square key={i}
                value={this.props.squares[i]}
                isSelected={i === this.props.selectedIdx}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderSquareRow(rowNum) {
        return (
            <div className="board-row" key={rowNum}>
                {
                    Array.from({ length: 3 }, (_, i) => rowNum * 3 + i)
                        .map((v, _) => {
                            return (this.renderSquare(v));
                        })
                }
            </div>
        );
    }

    render() {
        return (
            <div> {
                Array.from({ length: 3 }, (_, i) => i)
                    .map((v, _) => {
                        return (this.renderSquareRow(v));
                    })
            }
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
                idx: null,
            }],
            stepNumber: 0,
            xIsNext: true,
            dir: "ASC",
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                idx: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            wasJumped: false,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            wasJumped: true,
        });
    }

    onSiteChanged(val) {
        this.setState({
            dir: val,
        });
    }


    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let status;
        if (winner) {
            status = `Winner: ${winner}`;
        } else {
            status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
        }

        let moves = history.map((step, move) => {
            const h = history[move];
            const posX = Math.floor(h.idx % 3) + 1;
            const posY = Math.floor(h.idx / 3) + 1;
            const desc = move
                ? `Goto move ${move} [x=${posX}, y=${posY}]`
                : `Goto start`;
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        if (this.state.dir === 'DESC') {
            moves = moves.reverse();
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                        selectedIdx={this.state.wasJumped
                            ? current.idx
                            : null}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <input type="radio" name="direction" value="ASC" onChange={() => this.onSiteChanged('ASC')} />
                    <label>По возрастанию</label>
                    <input type="radio" name="direction" value="DESC" onChange={() => this.onSiteChanged('DESC')} />
                    <label>По убыванию</label>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
