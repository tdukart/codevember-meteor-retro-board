export const PERMISSION_LOGIN = 'login';
export const PERMISSION_CREATE_BOARD = 'board.create';
export const PERMISSION_ADMIN_OTHER_BOARDS = 'board.admin';
export const PERMISSION_ADMIN_USERS = 'users.admin';

const roles = {
  admin: [
    PERMISSION_ADMIN_USERS,
    PERMISSION_ADMIN_OTHER_BOARDS,
    PERMISSION_CREATE_BOARD,
    PERMISSION_LOGIN,
  ],
  boardAdmin: [
    PERMISSION_ADMIN_OTHER_BOARDS,
    PERMISSION_CREATE_BOARD,
    PERMISSION_LOGIN,
  ],
  user: [
    PERMISSION_LOGIN,
  ],
};

export default roles;
