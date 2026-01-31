import React, { useMemo, useState } from "react";
import "./App.css";

/**
 * Returns the winner for a given board, or null if no winner.
 * Board cells are "X", "O", or null.
 */
function calculateWinner(squares) {
  const lines = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function isDraw(squares, winner) {
  return !winner && squares.every((cell) => cell !== null);
}

// PUBLIC_INTERFACE
function App() {
  /** The 9-cell board, each cell is "X" | "O" | null */
  const [squares, setSquares] = useState(Array(9).fill(null));
  /** Current player; X starts */
  const [xIsNext, setXIsNext] = useState(true);

  const winner = useMemo(() => calculateWinner(squares), [squares]);
  const draw = useMemo(() => isDraw(squares, winner), [squares, winner]);

  const currentPlayer = xIsNext ? "X" : "O";

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (draw) return "Draw";
    return `Next player: ${currentPlayer}`;
  }, [winner, draw, currentPlayer]);

  const statusTone = useMemo(() => {
    if (winner) return "success";
    if (draw) return "neutral";
    return "primary";
  }, [winner, draw]);

  const gameOver = Boolean(winner) || draw;

  function handleSquareClick(index) {
    // Disallow moves after win/draw
    if (gameOver) return;
    // Disallow overwriting a marked cell
    if (squares[index] !== null) return;

    setSquares((prev) => {
      const next = [...prev];
      next[index] = currentPlayer;
      return next;
    });
    setXIsNext((prev) => !prev);
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="App">
      <main className="ttt-page">
        <section className="ttt-card" aria-label="Tic Tac Toe">
          <header className="ttt-header">
            <h1 className="ttt-title">Tic Tac Toe</h1>
            <p className="ttt-subtitle">Two players, one board. X starts.</p>
          </header>

          <div
            className={`ttt-status ttt-status--${statusTone}`}
            role="status"
            aria-live="polite"
          >
            <span className="ttt-status__label">{statusText}</span>
          </div>

          <div className="ttt-board" role="grid" aria-label="Game board">
            {squares.map((value, idx) => {
              const disabled = gameOver || value !== null;
              return (
                <button
                  key={idx}
                  type="button"
                  className={`ttt-cell ${value ? "ttt-cell--filled" : ""}`}
                  onClick={() => handleSquareClick(idx)}
                  disabled={disabled}
                  role="gridcell"
                  aria-label={`Cell ${idx + 1}${value ? `: ${value}` : ""}`}
                >
                  <span className="ttt-cell__value" aria-hidden="true">
                    {value ?? ""}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="ttt-actions">
            <button
              type="button"
              className="ttt-button"
              onClick={resetGame}
              aria-label="Reset game"
            >
              Reset
            </button>
            <p className="ttt-hint">
              Tip: Use Tab/Shift+Tab to navigate cells; Enter/Space to place a
              mark.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
