import styles from "./pane.module.css";

const Pane = ({ children }) => {
    return (
        <div className={styles.wrapper}>
            {children}
        </div>
    );
};

export default Pane;