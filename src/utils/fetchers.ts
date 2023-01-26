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
    }).then(async (res) => {
      // this will fail this request, but SWR will automatically
      // retry this request and it _should_ pick up the new token
      if (res.status === 401) {
        await refreshToken();
        throw new Error('token expired and refreshed');
      }
      if (res.ok) {
        return res.json();
      } else {
        // error handling for generic GET requests here
        // this is pretty simple and not very useful in a real world situation.
        // You'd definitely want to add error logging here
        throw Error;
      }
    });
  };

/**
 * GET messages are handled with the default fetcher above, but POST
 * requests require their own handler, since there is a body involved. This is
 * the handler for sending a message from the conversation page.
 */
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
      // error handling for generic GET requests here
      // this is pretty simple and not very useful in a real world situation.
      // You'd definitely want to add error logging here
      throw Error;
    }
  });
}
