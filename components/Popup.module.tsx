import React, { ReactNode } from "react";
import styles from "../styles/popup.module.css";

interface Props {
    children: ReactNode
}

export default function Popup({ children }: Props) {
    return (
        <div className={styles.container}>
            <div className={styles.popup}>
                {children}
            </div>
        </div>
    );
}