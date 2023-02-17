# README

## Features:

Concurrent servers, message reactions.

## Running locally

- `yarn` — Installs dependencies
- `yarn start` — Starts the Webpack and Node servers
- `yarn client` — Starts the Webpack server
- `yarn server` — Starts the Node server

## Tradeoffs and follow-ups

### Tradeoffs

Set vs Array: I was considering storing the userIds to each reaction as a Set to decrease running time of operations.
In `MessageViewer.jsx` and `index.js`  I need to check whether a userId is associated with a message's
emoji. `Set.has()` is O(1) while `Array.indexOf()` is O(n). Since we are not keeping an order of when users react, the
ordering
feature of the Array was not necessary. Yet Sets are not supported for JSON objects, so I went with an Array.

Concurrency: I was considering using then/catch to ensure concurrency, but decided to use async and await for
readability and to comply with the existing code format.

### Future

Display users: If I had more time, I would add a feature to display who has liked a certain emoji that the cursor has
hovered over. This could help with debugging; it is not clear, for example, when I am on User3, if User1 or User2 has
hearted a message.

More emojis: To increase readability of the Message class when adding more emojis (dozens, if not hundreds, including custom
emojis), I would consider different data structures to store the associated userIds with messageIds, perhaps adding a `reaction.db`and `reaction.js` on the backend. I would also wrap
the button html calls in `MessageViewer.jsx` into a new component, `MessageReactor.jsx`.

Forward-thinking code: I needed to downgrade my Node.js with `nvm use v16` to v16.19.0 in order to run the code. If I
had more time, and assuming the code continues to run on NeDB, I would look into how to make NeDB compatible with future versions of Node.js.
