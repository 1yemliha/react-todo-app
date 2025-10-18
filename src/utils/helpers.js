import Cookies from 'js-cookie';

const USER_COOKIE_NAME = 'todo_user';

export const setUserCookie = (user) => {
    // Kullanıcı bilgisini (id, username) 7 gün boyunca tut
    Cookies.set(USER_COOKIE_NAME, JSON.stringify(user), { expires: 7 });
};

export const getUserCookie = () => {
    const user = Cookies.get(USER_COOKIE_NAME);
    return user ? JSON.parse(user) : null;
};

export const removeUserCookie = () => {
    Cookies.remove(USER_COOKIE_NAME);
};