import {requestNotToken} from './axios';

export interface loginData {
    username: string,
    password: string
}
export const login = (data: loginData) => {
    return requestNotToken.post("/login/passwordLogin", {
        ...data
    }).then(res => res.data).then(err => err)
}