# HA Messaging Takehome

This is a takehome project building out a simple messaging client.

## Understanding the project

This project is based on the following tools:

- ReactJS
- NextJS
- TypeScript
- Eslint
- Tailwind CSS
- [SWR](https://swr.vercel.app)
  - this is a data fetching library that wraps the browser's `fetch` implementation.
  - It can be used for automatic refetching and cache management for REST requests.
  - I chose it here particularly beacuse it refetches data in the background, and
    will invalidate old data and reload the affected components intelligently, without
    loading states in the interim.

> Note about time: Because of the short window, testing, deployment, and storybook documentation for individual
> components was left off. In addition, many error flows like request failures have been outlined,
> but not handled with the care that any real deployed app should. I have left a couple comments
> including places where error telemetry could be placed, but otherwise, many of these cases
> just show an "Error" message for now.

## Directory Structure

- src
  - components
    - A few reusable components like Icons, User Boundaries, and message tiles
      live here to be used in the `/pages` dir.
  - pages
    - This dir is based around nextjs's [routing](https://nextjs.org/docs/routing/introduction)
      paradigm. In essence, it uses the path to a file under this directory as the
      url path, including dynamic elements like `customerId` for `conversation/customerId`.
  - utils
    - common elements like constants, auth hooks, and data fetching functions
      live here
  - types.ts
    - This is just a small assortment of useful TS types for things like `Message`s and
      `Conversation`s

## Running the application locally (preferred)

To run this application, clone this repo and then run the following (requires
[yarn](https://yarnpkg.com/getting-started/install) to be installed previously):

```
cd ha-messaging

# install dependencies
yarn

# starts nextjs development server
npm run dev
```

Once up and running, go to [localhost:3000](http://localhost:3000) to see the
app running.

## Testing Manually

When running the application locally:

- Enter test credentials on login page and click login
  - You will be redirected to the home page showing the list of conversations
  - you should be able to refresh the page without losing login state
- Click on a message thread to be taken to the thread
  - You should see recent message sorted by most recent on the bottom, and
    scroll position should be at the bottom next to recent messages, similar to
    the messages app on Mac/iPhone/Slack.
- Sending a message should work, and update the thread
- Clicking the "Messages" button at the top of the page will bring you back
  to the previous "conversations" page.
- Click logout, and you should be redirected to the login page.
- Navigating directly to `http://localhost:3000/` will notice you are not logged
  in and redirect you to login automatically.
