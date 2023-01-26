import { Message } from '../types';
import { BASE_URL } from './constants';

export const fetchWithUser =
  (refreshToken) =>
  async ([url, user]) => {
    const { access } = user;

    return fetch(`${BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access}`,
      },
      // in an ideal world, check the response for a header signaling that the
      // token should be refreshed, then make the refresh call here.
    }).then(async (res) => {
      if (res.status === 401) {
        await refreshToken();
        throw new Error('token expired and refreshed');
      }
      if (res.ok) {
        return res.json();
      } else {
        throw Error;
      }
    });
  };

export async function sendMessage({
  user,
  customerId,
  message,
}): Promise<Message> {
  return fetch(`${BASE_URL}/cp/messages/${customerId}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.access}`,
    },
    body: JSON.stringify({ message }),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw Error;
    }
  });
}
