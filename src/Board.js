import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";
import { render } from "@testing-library/react";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows, ncols, chanceLightStartsOn }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let y=0; y<nrows; y++) {
      let row = [];
      for (let x=0; x<ncols; x++) {
        row.push(Math.random() < chanceLightStartsOn);
      }
      initialBoard.push(row);
    }
    return initialBoard;
  }

  /** Check if the player has won */
  function hasWon() {
    for (let row of board) {
      for (let cell of row) {
        if (cell) {
          return false;
        }
      }
    }
    return true;
  }

  /** handle changing a cell: update board & flip neighbors */
  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      const newBoard = [...oldBoard];
      flipCell(y, x, newBoard)
      flipCell(y, x - 1, newBoard)
      flipCell(y, x + 1, newBoard)
      flipCell(y - 1, x, newBoard)
      flipCell(y + 1, x, newBoard)

      return newBoard;
    });
  }

  /** Render game board or winning message */
  function renderBoard() {
    return (
      <table className="Board">
        <tbody>
          {board.map((row, y) => (
            <tr key={y}>
              {row.map((cell, x) => (
                <Cell
                  key={`${y}-${x}`}
                  isLit={cell}
                  flipCellsAroundMe={() => flipCellsAround(`${y}-${x}`)}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return renderBoard();
}

export default Board;
