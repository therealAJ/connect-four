import React from 'react';
import './App.css';


function App() {
  return (
    <Board rows={6} columns={7}></Board>
  );
}

interface BoardState {
  columns: number,
  rows: number,
  board: number[][], 
  playerTurn: number,
  isWinner: boolean
}

interface BoardProps {
  columns: number,
  rows: number
}

enum PlayerTurn {
  PlayerOne = 1,
  PlayerTwo = -1
}

class Board extends React.Component<BoardProps, BoardState> {

  constructor(props: BoardProps) {
    super(props)
    this.state = {
      columns: this.props.columns,
      rows: this.props.rows,
      board: this.createBoard(this.props.rows, this.props.columns),
      playerTurn: PlayerTurn.PlayerOne,
      isWinner: false
    }
  }

  private createBoard = (rows: number, columns: number) => {
    const board: number[][] = new Array(rows)
                                       .fill(0)
                                       .map(() => new Array(columns)
                                       .fill(0));
    return board;
  }

  private renderBoard = (): React.ReactNode => {
    const { board } = this.state;

    //construct DOM 
    const rowDivs = [];
    for(let i = 0; i < board.length; i++) {
      const columnDivs = [];
      for (let j = 0; j < board[i].length; j++) {
      columnDivs.push(
      <div 
        style={{
        height: 30,
        width: 30, 
        border: '1px solid #000',
        display: 'flex',
        backgroundColor: this.determineCellColor(board[i][j]), 
        justifyContent: 'center'}}>
      </div>)
      }
      rowDivs.push(<div style={{display: 'flex', flexDirection: "row"}}>{columnDivs}</div>)
    }

    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {rowDivs}
      </div>
    )
     
  }

  private renderPlayerButtons = (): React.ReactNode => {
    const { columns } = this.state;
    const buttons = []
    for (let i = 0; i < columns; i++) {
      buttons.push(<div
        onClick={this.dropToken.bind(this, i)} 
        style={{
         height: 30,
         width: 30, 
         border: '1px solid #000', 
         display: 'flex',
         justifyContent: 'center',
         backgroundColor: 'pink'
         }}>
        </div>)
    }
    return buttons
  }

  private determineCellColor = (value: number): string => {
    switch(value) {
      case 1:
        return "red";
      case -1:
        return "yellow";
      default:
        return "white";
    }
  }

  private dropToken = (columnIndex: number, event: React.MouseEvent<HTMLDivElement>) => {
    let { board, rows, playerTurn } = this.state;
    for(let i = 0; i < rows; i++) {
      const currToken = board[i][columnIndex];
      if (i === 0 && currToken !== 0) {
        // column full
        window.alert("No valid moves here")
        break;
      } else if ((i === rows - 1 && currToken === 0) || (i < rows - 1 && board[i+1][columnIndex] !== 0)) {
        // found empty slot or first slot
        board[i][columnIndex] = playerTurn
        const isWinner = this.isHorizontalWin(playerTurn, i) || 
          this.isVerticalWin(playerTurn, columnIndex) || 
          this.isLeftHorizontalWin(playerTurn, i, columnIndex) || 
          this.isRightHorizontalWin(playerTurn, i, columnIndex); 
        this.setState({
          board,
          playerTurn: (isWinner && playerTurn) || -playerTurn,
          isWinner
        })
        break;
      } else {
        // drop lower
        continue;
      }
    } 
  }

  private isLeftHorizontalWin = (player: number, rowToSearch: number, columnIndex: number): boolean => {
    let x = rowToSearch;
    let y = columnIndex;
    const {rows, columns, board} = this.state;
    while (x !== 0 && y !== 0) {
      x--;
      y--;
    }

    let consecutiveHits = 0;
    for (let i = x, j = y; i < rows && j < columns; i++, j++) {
      if (board[i][j] === player) {
        consecutiveHits++;
        if (consecutiveHits === 4) return true;
      } else {
        consecutiveHits = 0;
      }
    }
    return false;
  }

  private isRightHorizontalWin = (player: number, rowToSearch: number, columnIndex: number): boolean => {
    let y = columnIndex;
    let x = rowToSearch;

    console.log("x " + x)
    console.log("y " + y)

    const {rows, columns, board} = this.state;
    while (y < columns && x !== 0) {
      y++;
      x--;
    }
    
    console.log("x " + x)
    console.log("y " + y)

    let consecutiveHits = 0;
    for (let i = x, j = y; (i < rows && j >= 0); i++, j--) {
      if (board[i][j] === player) {
        consecutiveHits++;
        if (consecutiveHits === 4) return true;
      } else {
        consecutiveHits = 0;
      }
    }
    return false;
  }

  private isHorizontalWin = (player: number, rowToSearch: number): boolean => {
    const { board } = this.state;
    const row = board[rowToSearch];
    let consecutiveHits = 0;
    for(let i = 0; i < row.length; i++) {
      if (row[i] === player) {
        consecutiveHits++;
        if (consecutiveHits === 4) return true;
      } else {
        consecutiveHits = 0;
      }
    }
    return false;
  }

  private isVerticalWin = (player: number, columnToSearch: number): boolean => {
    const { board, rows } = this.state;
    let consecutiveHits = 0;
    for(let i = 0; i < rows; i++) {
      if(board[i][columnToSearch] === player) {
        consecutiveHits++;
        if (consecutiveHits === 4) return true;
      } else {
        consecutiveHits = 0; 
      }
    }
    return false;
  }

  private alertWinner = (playerTurn: number) => {
    const playerName = playerTurn === PlayerTurn.PlayerOne ? "Red" : "Yellow";
    return <div>{playerName + " won!!!"}</div>
  }

  render() {

    const { playerTurn, isWinner } = this.state;

    return (
      <>
      <div style={{display: 'flex', justifyContent: 'center', marginTop: '200px'}}>
        {isWinner ? this.alertWinner(playerTurn) : this.renderPlayerButtons()}
      </div>
      <div id="container" style={{display: 'flex', justifyContent: 'center',  minHeight: '100vh'}}>
        {this.renderBoard()}
      </div>
      </>
    )
  }
}

export default App;
