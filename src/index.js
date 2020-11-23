import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
 // No parenthesis after onClick
	return (
		<button className="square" onClick={props.onClick} style={props.style}>
			{props.value}
		</button>
	);
}
class Board extends React.Component {
    renderSquare(i) {
	return (<Square
		value={this.props.squares[i]}
		onClick={() => this.props.onClick(i)}
		style={this.props.style(i)}
		/>
		);
    }
	getBoard ()
    {}
    render() {
	return (
	    <div>
		<div className="board-row">
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
	    </div>
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
			moveLocation: null,
		}],
		xIsNext: true,
		stepNumber: 0,
		stepListReversed: false,
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
				moveLocation: [i % 3, Math.floor(i / 3)],//[Math.floor(i / 3), i % 3],
				movePlayer: this.state.xIsNext ? 'X' : 'O',
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}
	jumpTo(step) {
		this.setState({
		stepNumber: step,
		xIsNext: (step % 2) === 0,
		});
	}

	toggleOrder() {
		this.setState({
			stepListReversed: !this.state.stepListReversed,
		});
	}

    render() {
	document.title = "Tic-Tac-Toe";
	const history = this.state.history;
	const current = history[this.state.stepNumber];
	const winner = calculateWinner(current.squares);
	const winning_square_style =  {"backgroundColor": "hsla(102, 100%, 60%, 0.51)",};
	
	const moves_original = history.map((step, move) => {
		const desc = move ?
			'Go to move #' + move + " (" + step.movePlayer + ": " + step.moveLocation + ")":
			'Go to game start';
		return (
		<li key={move}>
			{this.state.stepNumber === move ? 
			<button onClick={() => this.jumpTo(move)}><b>{desc} </b></button> :
			<button onClick={() => this.jumpTo(move)}>{desc}</button>}
		</li>
		);
	});
	const moves_reversed = moves_original.slice().reverse();

	const orderButton = <button onClick={() => this.toggleOrder()}>Toggle Move Order</button>;

	
	let status;
	if (winner) {
		status = 'Winner: ' + winner.winning_player;
	} else if (isDraw(current.squares)) {
		status = 'Draw'
	} else {
		status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
	}

	return (
	    <div className="game">
		<div className="game-board">
		<Board 
			squares={current.squares}
			onClick={(i) => this.handleClick(i)}
			style={(i) => winner && winner.winning_squares.includes(i) ? winning_square_style : {}}
		/>
		</div>
		<div className="game-info">
		<div>{status}</div>
		<div>{orderButton}</div>
		<div>{this.state.stepListReversed ? <ol reversed> {moves_reversed} </ol> : <ol> {moves_original} </ol>}</div>
		</div>
		</div>


	);
    }
}

// ========================================

ReactDOM.render(
	<Game />,
    document.getElementById('root')
);
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
			return {"winning_player": squares[a],
					"winning_squares": [a, b, c],
				};
		}
	}
	return null;
}

function isDraw(squares) {
	return squares.every((y) => y)
}
