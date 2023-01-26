import { BASE_URL } from './constants';
import { AuthUser } from './useAuth';

// @ts-ignore ts(2556)
const fetcher = (path, ...rest) =>
  fetch(`${BASE_URL}${path}`, ...rest).then((res) => res.json());

export const fetchWithUser = async ([url, user]) => {
  const { access } = user;

  return fetch(`${BASE_URL}${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access}`,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw Error;
    }
  });
};

export default fetcher;

// The extra argument will be passed via the `arg` property of the 2nd parameter.
// In the example below, `arg` will be `'my_token'`
// export async function sendMessage([url, user], { customerId, message }) {
export async function sendMessage([url, user], { customerId, message }) {
  console.log();
  await fetch(`${BASE_URL}/cp/messages/${customerId}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.access}`,
    },
  });
}
