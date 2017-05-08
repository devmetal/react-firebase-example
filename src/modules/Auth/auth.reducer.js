import { USER_SIGN_IN, USER_SIGN_OUT } from './auth.saga';

const defaultState = {
  user: null,
  signed: false,
};

export default (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_SIGN_IN:
      return { signed: true, user: payload };
    case USER_SIGN_OUT:
      return { signed: false, user: null };
    default:
      return state;
  }
};
