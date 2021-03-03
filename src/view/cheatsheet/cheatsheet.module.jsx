import React, { createContext, useContext, useEffect, useReducer } from 'react';

import { Link } from "react-router-dom";

import { Loading, Breadcrumb, Pane, Toolbar, DetailsList as UnorderdList } from "kayo";

import { doAjax } from "utils/ajax";

import { BootStrapIcon } from "plug/icons/icons";

import MarkdownRender from "plug/markdown/renderer/markdown.renderer.module";

import viewerStyles from "./sheet.viewer.module.css";
import editorStyles from "./sheet.editor.module.css";

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

const SheetProvider = ({ params, children }) => {
    const [state, dispatch] = useReducer(reducer, null);
    useEffect(() => {
        doAjax({ url: '/zip/cheatsheets.json' }).then(({ payload }) => {
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
        <div className={viewerStyles.masonry}>
            {(items || []).map(({ title, content }, index) => (
                <div className={viewerStyles.card} key={index}>
                    <Pane>
                        <h3>{title}</h3>
                        <article>
                            <MarkdownRender source={content || '> Nothing here!'} />
                        </article>
                    </Pane>
                </div>
            ))}
        </div>
    );
};

const SheetViewer = () => {
    const item = useContext(SheetContext);
    return (
        <div className={viewerStyles.viewer}>
            <Breadcrumb>
                <Link key={0} to="/cheatsheets">🏠</Link>
                <a href={`${process.env.REACT_APP_GH_REPO}/tree/main/zip/${item.filepath}`} rel="noreferrer" target="_blank">{item.desc || item.unique}</a>
            </Breadcrumb>
            <div className={viewerStyles.board}>
                <Masonry items={item.cards} />
            </div>
        </div>
    );
};

export const SheetCates = () => {
    return (
        <SheetProvider params={{ unique: 'main' }}>
            <SheetViewer />
        </SheetProvider>
    );
};

const EditableCard = ({ content, title }) => {
    const bindEvent = (type) => { console.log(type); };
    return (
        <div key={title} x={title}>
            <div>
                <div>
                    <input defaultValue={title || '暂未设置'} />
                </div>
                <div>
                    <textarea rows="3" defaultValue={content || '暂未设置'} />
                </div>
            </div>
            <Toolbar bindEvent={ ({ type }) => bindEvent(type) }>
                <BootStrapIcon slug="aspect-ratio" type="full" />
                <BootStrapIcon slug="arrow-bar-up" type="up" />
                <BootStrapIcon slug="arrow-bar-down" type="down" />
                <BootStrapIcon slug="trash" type="remove" />
            </Toolbar>
        </div>
    );
}

const SheetEditor = () => {
    const { desc, cards = [] } = useContext(SheetContext);
    return (
        <div className={editorStyles.editor}>
            <div className="container">
                <div>
                    <input defaultValue={desc || '暂未设置'} />
                </div>
                <UnorderdList items={cards} render={EditableCard} />
            </div>
        </div>
    );
};

// http://www.cheat-sheets.org/
export const SheetBoard = ({ match, location }) => {
    const editor = process.env.NODE_ENV === 'development' && location.search === '?editor';
    return (
        <SheetProvider params={match.params}>
            { editor ? (<SheetEditor />) : (<SheetViewer />)}
        </SheetProvider>
    );
};
