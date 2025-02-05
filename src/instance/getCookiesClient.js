'use client';

import { getCookie } from 'cookies-next';

export const getCookieClient = (name) => {
  const cookie = getCookie(name);
  return cookie;
};
