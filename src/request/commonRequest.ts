import {requestToken} from "./axios";
import JSONBig from 'json-bigint'

export const commonGet = (url: string, data?: any) => {
    return requestToken.get(url, {
        headers: {
            token: localStorage.getItem('token') as string,
        },
        params: {
            ...data
        }
    }).then(res => res.data).catch(err => console.log(err))
}

export const commonPost = (url: string, data?: any) => {
    return requestToken.post(url, {
        ...data
    }, {
        headers: {
            token: localStorage.getItem('token') as string,
        },
    }).then(res => res.data).catch(err => console.log(err))
}

export const commonPut = (url: string, data?: any) => {
    return requestToken.put(url, {
        ...data
    }, {
        headers: {
            token: localStorage.getItem('token') as string,
        },
    }).then(res => res.data).catch(err => console.log(err))
}

export const commonDelete = (url: string) => {
    return requestToken.delete(url, {
        headers: {
            token: localStorage.getItem('token') as string,
        },
    }).then(res => res.data).catch(err => console.log(err))
}

export const handleBigNumber = (data) => {
    try {
        data = JSONBig.parse(data);
        let str: string = "";
        data.c.forEach(item => {
            let temp = item.toString();
            if (temp.length == 13) temp = "0" + temp;
            str += temp;
        })
        return str;
    } catch (err) {
        return data
    }
}