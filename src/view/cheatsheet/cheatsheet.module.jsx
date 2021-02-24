import React, { createContext, useContext, useEffect, useReducer } from 'react';

import { Link } from "react-router-dom";

import { Loading, Breadcrumb, Card } from "kayo";

import { doAjax } from "utils/ajax";

import MarkdownRender from "plug/markdown/render/markdown.render.module";

import styles from "./cheatsheet.module.css";

const reducer = (state, action) => {
    const { type, params, source } = action;
    switch (type) {
        case 'FETCH_ITEM':
            return source[params.unique] || false;
        default:
            throw new Error();
    }
};

const SheetContext = createContext(null);

const SheetWrapper = ({ params, children }) => {
    const [state, dispatch] = useReducer(reducer, null);
    useEffect(() => {
        doAjax({ url: '/zip/cheatsheets.json' }).then(({ status, payload }) => {
            dispatch({ type: 'FETCH_ITEM', params, source: payload });
        });
    }, [params]);
    if (null === state) {
        return (
            <Loading />
        );
    }
    if (false === state) {
        return (
            <span>404 - NOT FOUND</span>
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
            {(items || []).map(({ title, html, content }, index) => (
                <div className={styles.card} key={index}>
                    <h3>{title}</h3>
                    <Card>
                        <article>
                            <MarkdownRender source={content || '> Nothing here!'} />
                        </article>
                    </Card>
                </div>
            ))}
        </div>
    );
};

const SheetObject = () => {
    const item = useContext(SheetContext);
    return (
        <div className={styles.wrapper}>
            <Breadcrumb>
                <Link key={0} to="/cheatsheets">🏠</Link>
                <a href={`${process.env.REACT_APP_GH_REPO}//tree/main/zip/${item.filepath}`} rel="noreferrer" target="_blank">{item.desc || item.unique}</a>
            </Breadcrumb>
            <div className={styles.board}>
                <Masonry items={item.cards} />
            </div>
        </div>
    );
};

export const SheetCates = () => {
    return (
        <SheetWrapper params={{ unique: 'main' }}>
            <SheetObject />
        </SheetWrapper>
    );
};

// http://www.cheat-sheets.org/
export const SheetBoard = ({ match }) => {
    return (
        <SheetWrapper params={match.params}>
            <SheetObject />
        </SheetWrapper>
    );
};
