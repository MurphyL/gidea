import styles from "./card.module.css";

const Card = ({ children }) => {
    return (
        <div className={styles.wrapper}>
            {children}
        </div>
    );
};

export default Card;