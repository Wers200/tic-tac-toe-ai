//#region Imports
import React from "react";
import Popup from "../components/Popup.module";
import styles from "../styles/index.module.css";
//#endregion

interface Props {
    onRestart: React.MouseEventHandler<HTMLButtonElement>,
    onView: React.MouseEventHandler<HTMLButtonElement>,
    gameEndStatus: string
    show: boolean
}

export default function GameEndPopup({ onRestart, onView, gameEndStatus, show }: Props) {
    if(show) {
        return (
            <Popup>
                <div className={styles.subtitle}>{gameEndStatus}</div>
                <div className={styles.buttonwrapper}>
                    <button className={styles.popupbtn} onClick={onRestart} aria-label="Restart">
                        <svg width="60" height="60" viewBox="0 0 1 1">
                            <use href="#svg-restart-icon" />
                        </svg>
                    </button>
                    <button className={styles.popupbtn} onClick={onView} aria-label="View">
                        <svg width="60" height="60" viewBox="0 0 1 1">
                            <use href="#svg-view-icon" />
                        </svg>
                    </button>
                </div>
            </Popup>
        );
    } else return null;
}