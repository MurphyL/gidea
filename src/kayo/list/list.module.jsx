import { createElement, Fragment } from "react";

export const Items = ({ render: ItemRender, element = 'div', children, items = [] }) => (
    items.map((item, index) => (
        createElement(element, { key: index }, (
            <ItemRender {...item}>{children}</ItemRender>
        ))
    ))
);

export const List = ({ className = '', type = 'div', element = Fragment, unique, ...props }) => (
    createElement(type, { className: `${className} ${unique} l` }, (
        <Items {...props} element={element} />
    ))
);

export const DetailsList = (props) => (
    <List {...props} type="dl" />
);

export const OrderdList = (props) => (
    <List {...props} type="ol" element="li" />
);

export const UnorderdList = (props) => (
    <List {...props} type="ul" element="li" />
);

export default List;
