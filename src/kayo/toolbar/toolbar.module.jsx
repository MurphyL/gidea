
import { Children, Fragment } from "react";

import styles from "./toolbar.module.css";

export const Toolbar = ({ children, bindEvent }) => (
    <ol className={styles.wrapper}>
        {Children.map(children, (child, index) => (
            <Fragment key={index}>
                <li onClick={() => bindEvent(child.props)}>{child}</li>
            </Fragment>
        ))}
    </ol>
);