import { Children } from "react";

import styles from "./breadcrumb.module.css";

const Breadcrumb = ({ children, className, separator }) => {
    return (
        <div className={["kayo-breadcrumb", className].join(' ')}>
            <ol className={styles.wrapper}>
                {Children.count(children) && (
                    Children.map(children, (item, index) => [
                        (index > 0) && <Separator key={0} placeholder={separator} />,
                        <BreadcrumbItem key={1}>{item}</BreadcrumbItem>
                    ])
                )}
            </ol>
        </div>
    );
};

const BreadcrumbItem = ({ children }) => {
    return (
        <li className={styles.item}>{children}</li>
    );
};

const Separator = ({ placeholder }) => {
    return (
        <li className={styles.separator}>{placeholder || '/'}</li>
    );
};

export default Breadcrumb;
