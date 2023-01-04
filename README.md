# twitter-dom

This package provides a simple way for content scripts to get the nodes containing tweets
on Twitter.com.

It provides a single class `StatusObserver` that you instantiate with a callback
function that gets called when new tweet statuses are added to the DOM.

`StatusObserver` has only 2 methods:

`observe()` and `disconnect` which starts and stops listening to the DOM respectively.

## Installation (via NPM)

```bash
npm install @imborge/twitter-dom --save
```

## Sample usage

Make promoted tweets have a gray background:

```javascript
import { StatusObserver } from "@imborge/twitter-dom";

const observer = new StatusObserver((statusNode, statusID, username) => {
  // statusID and username is extracted from links inside
  // status wrapper elements.
  
  // Promoted tweets don't have links containing
  // the status id of the tweet.
  if (!statusID) {
    statusNode.style.background = "rgba(0, 0, 0, .1)";
  }
});

observer.observe();
```
