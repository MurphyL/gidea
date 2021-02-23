import React from 'react';

import { BrowserRouter, Switch, Route } from "react-router-dom";

import CheatSheet, { SheetList, SheetCates } from "view/cheatsheet/cheatsheet.module";

const App = () => {
    return (
        <React.StrictMode>
            <BrowserRouter>
                <Switch>
                    <Route path="/about">
                        <div>about</div>
                    </Route>
                    <Route exact path="/cheatsheets" component={ SheetCates } />
                    <Route exact path="/cheatsheets/:unique" component={ SheetList } />
                    <Route exact path="/cheatsheets/:cate/:unique" component={ CheatSheet } />
                    <Route path="/">
                        <div>home</div>
                    </Route>
                    <Route>
                        404
                    </Route>
                </Switch>
            </BrowserRouter>
        </React.StrictMode>
    );
};

export default App;
