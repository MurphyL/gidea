import styles from "./loading.module.css";

const Loading = ({ message }) => {
    return (
        <div className={styles.loading}>
            <div>{message || '数据加载中……'}</div>
        </div>
    );
};

export default Loading;