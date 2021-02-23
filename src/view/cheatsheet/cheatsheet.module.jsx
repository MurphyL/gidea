import React, { createContext, useContext, useEffect, useReducer } from 'react';

import { Link } from "react-router-dom";

import { Loading, Breadcrumb } from "kayo";

import { doAjax } from "utils/ajax";

import styles from "./cheatsheet.module.css";

import 'highlight.js/styles/github.css';

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
            {(items || []).map(({ title, html }, index) => (
                <div className={styles.card} key={index}>
                    <h3>{title}</h3>
                    <article dangerouslySetInnerHTML={{ __html: html }}></article>
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
                <span>{item.desc || item.unique}</span>
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
