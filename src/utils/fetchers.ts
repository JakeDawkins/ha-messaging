// @ts-ignore ts(2556)
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default fetcher;
