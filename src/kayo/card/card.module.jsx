import styles from "./card.module.css";

const Card = ({ children, className }) => {
    return (
        <div className={ ["kayo-card", className].join(' ') }>
            <div className={styles.wrapper}>
                {children}
            </div>
        </div>
    );
};

export default Card;