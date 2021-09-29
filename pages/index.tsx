//#region Imports
import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";

import styles from "../styles/index.module.css";
import classNames from "classnames";

import { Point } from "../lib/arrayhelper.module";
import TicTacToe, { GameState, CellState, BotDifficulty } from "../lib/tictactoe.module";

import SVGAssets from "../components/SVGAssets.module";

import GameEndPopup from "../popups/gameend.module";
//#endregion

const GameEndMessages = [
    "Player 1 (X) won.",
    "Player 2 (O) won.",
    "No one won (Draw)."
];

export default function Page() {
    //#region Variables
    const [sTable, sTableSet] = useState(TicTacToe.CreateGameTable());
    const [sGameState, sGameStateSet] = useState(GameState.Playing);
    const [sViewing, sViewingSet] = useState(false);
    const [sPlayingAs, sPlayingAsSet] = useState(CellState.X);
    const [sScore, sScoreSet] = useState({ player: 0, tie: 0, computer: 0 });
    const [sBotDifficulty, sBotDifficultySet] = useState(BotDifficulty.Easy);
    let table = Array.from(sTable);
    let gameState = GameState.Playing;
    const lastBotMove = useRef(Point.OneInverted);
    const lastPlayerMove = useRef(Point.OneInverted);
    //#endregion

    const onCellClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const index: number = Number(e.currentTarget.getAttribute("data-index"));
        if (table[index] === CellState.None) {
            table[index] = sPlayingAs;
            lastPlayerMove.current = Point.Get2DIndexFrom1D(index, 3);
            gameState = TicTacToe.CheckGameState(table, lastPlayerMove.current);
            if (gameState === GameState.Playing) {
                lastBotMove.current = TicTacToe.MakeABotMove(sBotDifficulty, table, sPlayingAs, lastPlayerMove.current, lastBotMove.current);
                table[lastBotMove.current.Get1DIndexFrom2D(3)] = sPlayingAs === CellState.X ? CellState.O : CellState.X;
                gameState = TicTacToe.CheckGameState(table, lastBotMove.current);
            }
            if(gameState !== GameState.Playing) {
                sScoreSet({
                    player: sScore.player + (
                    (gameState === GameState.XWon && sPlayingAs === CellState.X) ||
                    (gameState === GameState.OWon && sPlayingAs === CellState.O) ? 1 : 0),
                    tie: sScore.tie + (gameState === GameState.Draw ? 1 : 0),
                    computer: sScore.computer + (
                    (gameState === GameState.XWon && sPlayingAs === CellState.O) ||
                    (gameState === GameState.OWon && sPlayingAs === CellState.X) ? 1 : 0),
                });
            }
            sGameStateSet(gameState);
            sTableSet(table);  
        }
    }

    const onRestartButtonClick = () => {
        sViewingSet(false);
        table = TicTacToe.CreateGameTable();
        lastPlayerMove.current = Point.OneInverted;
        lastBotMove.current = Point.OneInverted;
        if(sPlayingAs === CellState.O) {
            lastBotMove.current = TicTacToe.MakeABotMove(sBotDifficulty, table, sPlayingAs, lastPlayerMove.current, lastBotMove.current);
            table[lastBotMove.current.Get1DIndexFrom2D(3)] = CellState.X;
        }
        sGameStateSet(GameState.Playing);
        sTableSet(table);
    }

    const onPlayingAsClick = () => {
        //#region Restart
        sViewingSet(false);
        table = TicTacToe.CreateGameTable();
        lastBotMove.current = Point.OneInverted;
        if(sPlayingAs === CellState.X) {
            lastBotMove.current = TicTacToe.MakeABotMove(sBotDifficulty, table, sPlayingAs, lastPlayerMove.current, lastBotMove.current);
            table[lastBotMove.current.Get1DIndexFrom2D(3)] = CellState.X;
        }
        sGameStateSet(GameState.Playing);
        sTableSet(table);
        //#endregion
        sScoreSet({ player: 0, tie: 0, computer: 0 });
        sPlayingAsSet(sPlayingAs == CellState.X ? CellState.O : CellState.X);
    }
    
    const onDifficultyClick = () => {
        const newDifficulty = sBotDifficulty === 0 ? 1 : sBotDifficulty === 1 ? 2 : 0;
        //#region Restart
        sViewingSet(false);
        table = TicTacToe.CreateGameTable();
        lastBotMove.current = Point.OneInverted;
        if(sPlayingAs === CellState.O) {
            lastBotMove.current = TicTacToe.MakeABotMove(newDifficulty, table, sPlayingAs, lastPlayerMove.current, lastBotMove.current);
            table[lastBotMove.current.Get1DIndexFrom2D(3)] = CellState.X;
        }
        sGameStateSet(GameState.Playing);
        sTableSet(table);
        //#endregion
        sScoreSet({ player: 0, tie: 0, computer: 0 });
        sBotDifficultySet(newDifficulty);
    }

    return (
        <>
            <Head>
                <title>localhost:1337</title>
                <meta name="description" content="Another random site, I guess."></meta>
            </Head>
            <div className="app">
                <SVGAssets />

                <div className={styles.title} style={{marginTop: "10px"}}>Tic-Tac-Toe!</div>
                <div className={styles.subtitle}>Another Tic-Tac-Toe repository?</div>
                <div className={styles.xocontainer}>
                    <div className={styles.xotable}>
                        {sTable.map((cell, index) =>
                            <button key={index} data-index={index} onClick={onCellClick} 
                            className={classNames(styles.xobutton, { [styles.notallowed]: cell !== 0 }, { [styles.overlayed]: (sGameState !== GameState.Playing && !sViewing) })}
                            disabled={sGameState !== 3} style={{ transitionDuration: sGameState !== 3 ? 0 + "ms" : 300 + "ms" }}>
                                <svg width="75" height="75" viewBox="0 0 1 1" className={styles.xoicon}>
                                    <use href={`#svg-xoicon-${cell}`} />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
                <div className={styles.xomenu}>
                    <div className={styles.xoscore}>
                        <span style={{fontSize: "24px"}}>Player</span>
                        <span style={{fontSize: "36px", fontWeight: "bold"}}>{sScore.player}</span>
                    </div>
                    <div className={styles.xoscore}>
                        <span style={{fontSize: "24px"}}>Tie</span>
                        <span style={{fontSize: "36px", fontWeight: "bold"}}>{sScore.tie}</span>
                    </div>
                    <div className={styles.xoscore}>
                        <span style={{fontSize: "24px"}}>Computer</span>
                        <span style={{fontSize: "36px", fontWeight: "bold"}}>{sScore.computer}</span>
                    </div>
                    <div className={styles.xoscore}>
                        <span style={{fontSize: "24px", paddingTop: "5px"}}>Playing as</span>
                        <button className={styles.transparent} onClick={onPlayingAsClick}>
                            <svg width="30" height="30" viewBox="0 0 1 1">
                                <use href={`#svg-xoicon-${sPlayingAs}`} />    
                            </svg>
                        </button>
                    </div>
                    <div className={styles.xoscore}>
                        <span style={{fontSize: "24px", paddingTop: "5px"}}>Difficulty</span>
                        <button className={styles.transparent} onClick={onDifficultyClick}>
                            <svg width="30" height="30" viewBox="0 0 1 1">
                                <use href={`#svg-face-icon-${sBotDifficulty}`} />    
                            </svg>
                        </button>
                    </div>
                </div>

                <GameEndPopup gameEndStatus={GameEndMessages[sGameState]} onRestart={onRestartButtonClick} onView={() => { sViewingSet(true); }} show={sGameState !== GameState.Playing && !sViewing} />

                {
                    sViewing ? (
                        <button className={styles.cornerbtn} onClick={onRestartButtonClick} aria-label="Restart">
                            <svg width="48" height="48" viewBox="0 0 1 1">
                                <use href="#svg-restart-icon" />
                            </svg>
                        </button>
                    ) : null
                }
            </div>
        </>
    );
}