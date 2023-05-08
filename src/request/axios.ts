import axios from "axios";
import JSONBig from 'json-bigint'

export const requestNotToken = axios.create({
    baseURL: 'http://localhost:9090/',
    transformResponse: [
        function (data) {
            // 对 data 进行任意转换处理
            try {
                data = JSONBig.parse(data);
                data.list.filter((item)=>{
                    item.id = item.id.toString();
                    return item;
                })
                return data;
            } catch (err) {
                return data
            }
        }
    ]
});

export const requestToken = axios.create({
    baseURL: 'http://localhost:9090',
    transformResponse: [
        function (data) {
            // 对 data 进行任意转换处理
            try {
                data = JSONBig.parse(data);
                data.list.filter((item)=>{
                    item.id = item.id.toString();
                    return item;
                })
                return data;
            } catch (err) {
                return data
            }
        }
    ]
});