# chat-history-viewer
A more pleasant experience to view conversation history. 
Display messages extracted by a third-party tool.

## Features unique to this viewer
- Tagging/Bookmarking
  - Jump to your favorite points in time to relive special moments
  - Bookmark where you paused to continue next time
- Bulk loading
  - Load any number of messages in bulk with one click

## Other features (similar to the default viewer of messaging apps)
- Scroll upward to load messages
- Search (including messages that have not been loaded)

## Screenshot
<screenshot>

## About the system
<pic>

## How to run
1. Host a MongoDB at localhost:27017 (configured at ./express/server/server.js)
2. Start Express server
   ```
   cd ./express
   npm start
   ```
3. Compile and execute Haskell script by
   ```
   cd ../haskell
   ghc --make ./parse_html_and_post_to_server.hs
   ./parse_html_and_post_to_server
   ```
   This will populate MongoDB with the messages in haskell/sample_messages.html
4. Bundle and serve the React app
   ```
   cd ../react
   npm start
   ```
5. Visit localhost:8080 in a browser
