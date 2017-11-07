import { Stickies } from '../../api/stickies';

export const CREATE_STICKY = 'CREATE_STICKY';

export const createSticky = ({
  body,
  color,
  type,
  boardId,
}) => {
  const id = Stickies.insert({
    boardId,
    body,
    color,
    type,
  });
  return {
    action: CREATE_STICKY,
    sticky: {
      id,
      boardId,
      body,
      color,
      type,
    },
  };
};
