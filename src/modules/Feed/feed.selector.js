import { createSelector } from 'reselect';

const itemsSelector = state => state.feed.items;
const userSelector = state => state.auth.user;

export const itemsMapLikes = createSelector(
  itemsSelector,
  userSelector,
  (items, user) => items.map(item => ({
    ...item,
    likesCnt: (item.likes) ? Object.keys(item.likes).length : 0,
    userLiked: (item.likes) ? Object.keys(item.likes).includes(user.id) : false,
  }))
);
