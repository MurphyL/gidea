import styles from "./loading.module.css";

const Loading = ({ className, message }) => {
    return (
        <div className={["kayo-loading", className].join(' ')}>
            <div className={styles.loading}>
                <div>{message || '数据加载中……'}</div>
            </div>
        </div>
    );
};

export default Loading;