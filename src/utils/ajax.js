import { useEffect, useState } from 'react';

import axios from 'axios';

export const useAjax = ({ method = 'GET', url = '' }) => {
    const [response, setResponse] = useState({ status: 1 });
    useEffect(() => {
        axios.request({
            method, url
        }).then(({ status, data }) => {
            if (status === 200) {
                setResponse({ status: 0, payload: data })
            } else {
                setResponse({ status: 2, message: '调用接口失败' })
            }
        }).catch(() => {
            setResponse({ status: 2, message: '请求数据出错' })
        });
    }, [method, url]);
    return response;
};

export const doAjax = ({ method = 'GET', url = '' }) => {
    return axios.request({ method, url }).then(({ status, data }) => {
        if (status === 200) {
            return { status: 0, payload: data };
        } else {
            return { status: 2, message: '调用接口失败' };
        }
    }).catch(() => {
        return { status: 2, message: '请求数据出错' };
    });
};