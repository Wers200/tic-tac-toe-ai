import { Point, Size, ArrayLogic } from "./arrayhelper.module";
import Mathf from "./mathf.module";

//#region Enums
export enum BotDifficulty {
    Easy,
    Normal,
    Hard
};

export enum CellState {
    None ,
    X,
    O
};

export enum GameState {
    XWon,
    OWon,
    Draw,
    Playing
};
//#endregion

export default class TicTacToe {
    static CreateGameTable(): number[] {
        return ArrayLogic.CreateArray(new Size(3, 3), CellState.None);  
    }

    static MakeABotMove(difficulty: number, gameTable: number[], playerCellState: CellState, lastPlayerMove: Point, lastBotMove: Point) {
        let botCellState = playerCellState === CellState.X ? CellState.O : CellState.X;
        switch(difficulty) {
            case BotDifficulty.Easy: 
                let possibleMoves = this.GetPossibleMoves(gameTable);
                let randomNumber = Mathf.randomInt(0, possibleMoves.length);
                gameTable[possibleMoves[randomNumber]] = botCellState;
                return Point.Get2DIndexFrom1D(possibleMoves[randomNumber], 3);
            case BotDifficulty.Normal:
                let botWinMoves = this.GetPotentionalWinMoves(gameTable, botCellState, lastBotMove, 1);
                let playerWinMoves = this.GetPotentionalWinMoves(gameTable, playerCellState, lastPlayerMove, 1);
                if(botWinMoves.length > 0) {
                    let randomNumber = Mathf.randomInt(0, botWinMoves.length);
                    gameTable[botWinMoves[randomNumber][0].Get1DIndexFrom2D(3)] = botCellState;
                    return botWinMoves[randomNumber][0];
                } else if(playerWinMoves.length > 0) {  
                    let randomNumber = Mathf.randomInt(0, playerWinMoves.length);
                    gameTable[playerWinMoves[randomNumber][0].Get1DIndexFrom2D(3)] = botCellState;
                    return playerWinMoves[randomNumber][0];
                } else {
                    let possibleMoves = this.GetPossibleMoves(gameTable);
                    let randomNumber = Mathf.randomInt(0, possibleMoves.length);
                    gameTable[possibleMoves[randomNumber]] = botCellState;
                    return Point.Get2DIndexFrom1D(possibleMoves[randomNumber], 3);
                }
            case BotDifficulty.Hard:
                if(lastBotMove === Point.OneInverted) {        
                    if(gameTable[4] === CellState.None) {
                        gameTable[4] = botCellState;
                        return new Point(1, 1);
                    } else {
                        let corner = new Point(Mathf.randomBool() ? 0 : 2, Mathf.randomBool() ? 0 : 2);
                        gameTable[corner.Get1DIndexFrom2D(3)] = botCellState;
                        return corner;
                    }
                } else {
                    let botWinMoves = this.GetPotentionalWinMoves(gameTable, botCellState, lastBotMove, 1);
                    let botGoodMoves = this.GetPotentionalWinMoves(gameTable, botCellState, lastBotMove, 2);
                    let playerWinMoves = this.GetPotentionalWinMoves(gameTable, playerCellState, lastPlayerMove, 1);
                    if(botWinMoves.length > 0) {
                        let randomNumber = Mathf.randomInt(0, botWinMoves.length);
                        gameTable[botWinMoves[randomNumber][0].Get1DIndexFrom2D(3)] = botCellState;
                        return botWinMoves[randomNumber][0];
                    } else if(playerWinMoves.length > 0) {
                        let randomNumber = Mathf.randomInt(0, playerWinMoves.length);
                        gameTable[playerWinMoves[randomNumber][0].Get1DIndexFrom2D(3)] = botCellState;
                        return playerWinMoves[randomNumber][0];
                    } else if(botGoodMoves.length > 0) {
                        let randomNumber = Mathf.randomInt(0, botGoodMoves.length);
                        gameTable[botGoodMoves[randomNumber][0].Get1DIndexFrom2D(3)] = botCellState;
                        return botGoodMoves[randomNumber][0];
                    } else {
                        let possibleMoves = this.GetPossibleMoves(gameTable);
                        let randomNumber = Mathf.randomInt(0, possibleMoves.length);
                        gameTable[possibleMoves[randomNumber]] = botCellState;
                        return Point.Get2DIndexFrom1D(possibleMoves[randomNumber], 3);
                    }
                }
        }
    }

    static GetPossibleMoves(gameTable: number[]): number[] {
        let possibleMoves = new Array<number>();
        gameTable.forEach((cell, index) => {
            if(cell === CellState.None) {
                possibleMoves.push(index);
            }
        });
        return possibleMoves;
    }
    
    static GetPotentionalWinMoves(gameTable: number[], playerCellState: CellState, lastPlayerMove: Point, movesLimit: number): [Point[]?] {
        let winCombinations: [Point[]?] = [];
        if(!lastPlayerMove.IsOutOfBounds(new Size(3, 3))) {
            for(let i = 0; i < 4; i++) {
                let direction = i === 0 ? Point.Left : i === 1 ? Point.UpLeft : i === 2 ? Point.Up : Point.UpRight;
                let info = ArrayLogic.ShootInfoRay(lastPlayerMove, 3, direction, gameTable, new Size(3, 3), [playerCellState, CellState.None], true);
                if(info.numberInfo[CellState.None] <= movesLimit && info.rayPath.length === 3) {
                    let points: Point[] = [];
                    for(let i = 0; i < 3; i++) {
                        if(gameTable[info.rayPath[i].Get1DIndexFrom2D(3)] == CellState.None) points.push(info.rayPath[i]);
                    }
                    winCombinations.push(points);
                }
            }
        }
        return winCombinations;
    }

    static CheckGameState(gameTable: number[], lastMove: Point) {
        let moveSign = gameTable[lastMove.Get1DIndexFrom2D(3)];
        if(lastMove === Point.OneInverted) return GameState.Playing;
        else if(ArrayLogic.ShootCheckerRay2(lastMove, Point.Left, gameTable, new Size(3, 3), [moveSign], 3)
        || ArrayLogic.ShootCheckerRay2(lastMove, Point.UpLeft, gameTable, new Size(3, 3), [moveSign], 3)
        || ArrayLogic.ShootCheckerRay2(lastMove, Point.Up, gameTable, new Size(3, 3), [moveSign], 3)
        || ArrayLogic.ShootCheckerRay2(lastMove, Point.UpRight, gameTable, new Size(3, 3), [moveSign], 3)) {
            return moveSign === CellState.X ? GameState.XWon : GameState.OWon;
        } else if(this.GetPossibleMoves(gameTable).length === 0) {
            return GameState.Draw;
        } else return GameState.Playing;
    }
}
