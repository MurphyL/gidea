import React, { createContext, useContext, useEffect, useReducer } from 'react';

import { Link } from "react-router-dom";

import Markdown from 'markdown-to-jsx';

import { Loading, Breadcrumb } from "kayo";

import { doAjax } from "utils/ajax";

import styles from "./cheatsheet.module.css";

const fetchItem = ({ cates, items }, { cate, unique }) => {
    const cateObject = (cates || {})[cate];
    return cateObject && {
        source: { cates, items },
        cate: { unique: cate, name: cateObject.name },
        item: (items || []).find((item) => item.cate === cate && item.unique === unique)
    };
};

const reducer = (state, action) => {
    const { type, params, source } = action;
    switch (type) {
        case 'FETCH_ITEM':
            return fetchItem(source, params);
        default:
            throw new Error();
    }
};

const SheetContext = createContext(null);

const H4 = ({ children }) => {
    return (
        <h4>{ children }</h4>
    );
};

const h4Object = {
    component: H4,
    props: {
        className: 'title',
    },
};

const SheetWrapper = ({ params, children }) => {
    const [state, dispatch] = useReducer(reducer);
    useEffect(() => {
        doAjax({ url: '/zip/cheatsheets.json' }).then(({ status, payload }) => {
            dispatch({ type: 'FETCH_ITEM', params, source: payload });
        });
    }, [params]);
    if (!state) {
        return (
            <Loading />
        );
    }
    return (
        <SheetContext.Provider value={state}>
            { children}
        </SheetContext.Provider>
    );
};

const Masonry = ({ items }) => {
    return (
        <div className={styles.masonry}>
            {(items || []).map(({ title, content }, index) => (
                <div className={styles.card} key={index}>
                    <h3>{title}</h3>
                    <Markdown options={{
                        wrapper: 'article',
                        forceWrapper: true,
                        slugify: () => null,
                        overrides: {
                            h1: h4Object,
                            h2: h4Object,
                            h3: h4Object,
                            h4: h4Object,
                            a: {
                                component: ({ children, href }) => {
                                    return (
                                        <Link to={href}>{children}</Link>
                                    )
                                },
                            },
                            pre: {
                                component: ({ children }) => {
                                    if(children.type === 'code') {
                                        return (
                                            <pre className={ styles.code_block }>
                                                { children }
                                            </pre>
                                        );
                                    }
                                    return (
                                        <div></div>
                                    )
                                },
                            }
                        },
                    }}>{content}</Markdown>
                </div>
            ))}
        </div>
    );
};

const SheetObject = () => {
    const { item, cate } = useContext(SheetContext);
    return (
        <div className={styles.wrapper}>
            <Breadcrumb>
                {[
                    <Link key={0} to="/cheatsheets">🏠</Link>,
                    (cate.unique !== '_') && <Link key={1} to={`/cheatsheets/${cate.unique}`}>{cate.name || cate.unique}</Link>,
                    <Link key={2} to="#">{item.desc || item.unique}</Link>
                ].filter((item) => item)}
            </Breadcrumb>
            <div className={styles.board}>
                <Masonry items={item.cards} />
            </div>
        </div>
    );
};

export const SheetCates = () => {
    return (
        <SheetWrapper params={{ cate: '_', unique: 'main' }}>
            <SheetObject />
        </SheetWrapper>
    );
};

export const SheetList = ({ match }) => {
    return (
        <SheetWrapper params={{ cate: '_', ...match.params }}>
            <SheetObject />
        </SheetWrapper>
    );
};

// http://www.cheat-sheets.org/
const SheetBoard = ({ match }) => {
    return (
        <SheetWrapper params={match.params}>
            <SheetObject />
        </SheetWrapper>
    );
};

export default SheetBoard;
