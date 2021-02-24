import { createElement } from "react";

import Markdown from 'markdown-to-jsx';

import { Link } from "react-router-dom";

import highlighter from 'highlight.js';

import styles from "./markdown.render.module.css";

const Title = ({ level = 4, children }) => {
    const type = `h${(level > 4 ? level : 4)}`;
    const child = <span data-type={type.toUpperCase()}>{children}</span>;
    return createElement(type, { className: styles.doc_title }, child);
};

const HyperLink = ({ children, href, title }) => {
    return <Link to={href} title={title}>{children}</Link>;
};

const Paragraph = ({ children }) => {
    if (children && Array.isArray(children)) {
        if (children[0] && children[0].type === 'img') {
            return (
                <p className="image">{children}</p>
            )
        }
    }
    return (
        <p className={styles.paragraph}>{children}</p>
    );
};

const Prepare = ({ children }) => {
    if (children && typeof (children.type) === 'function') {
        const { className, children: content } = children.props;
        const langName = className.replace(/^lang-/, '');
        const { value: __html, top: lanType } = highlighter.highlight(langName, content);
        return (
            <div className={styles.doc_code_block} data-lang={ lanType.name }>
                <pre>
                    <code className={styles.doc_prepare_code} dangerouslySetInnerHTML={{__html }}/>
                </pre>
            </div>
        )
    }
    return (
        <div>TODO prepare block</div>
    );
};

const Code = ({ children, className }) => {
    return (
        <code className={className ? `${className} ${styles.doc_prepare_code}` : styles.doc_inline_code}>{children}</code>
    );
}

const BlockQuote = ({ children = [] }) => {
    return (
        <blockquote>{children.map(({ props }) => props.children)}</blockquote>
    );
};

const overrides = {
    p: {
        component: Paragraph
    },
    a: {
        component: HyperLink,
    },
    ul: {
        props: {
            className: `${styles.doc_ul} ${styles.doc_list}`
        }
    },
    ol: {
        props: {
            className: `${styles.doc_ol} ${styles.doc_list}`
        }
    },
    code: {
        component: Code
    },
    table: {
        props: {
            className: styles.doc_table
        }
    },
    pre: {
        component: Prepare
    },
    blockquote: {
        component: BlockQuote
    },
};

for (let level = 1; level < 10; level++) {
    overrides[`h${level}`] = {
        component: Title,
        props: {
            level
        }
    }
}

const markdownOptions = {
    wrapper: 'section',
    forceWrapper: true,
    overrides
};

const MarkdownRender = ({ source }) => {
    return (
        <div className={styles.wrapper}>
            <Markdown children={source} options={markdownOptions} />
        </div>
    );
};

Markdown.displayName = "Render";
MarkdownRender.displayName = "Markdown";

export default MarkdownRender;