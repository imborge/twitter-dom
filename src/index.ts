function extractDataFromStatusLink(statusLink: HTMLAnchorElement | string) {
  let href;

  if (typeof statusLink == "string") {
    href = statusLink;
  } else {
    href = statusLink.href.toString();
  }

  return href.match(/https:\/\/twitter\.com\/(?<username>.*)\/status\/(?<statusID>[0-9]*)/)?.groups;
}

/**
 * When injected to Twitter, provides the ability to watch for tweet statuses added to the
 * DOM.
 */
export class StatusObserver {
  private readonly statusCallback;
  private readonly observer;

  /**
   * Callback for StatusObserver
   *
   * @callback statusObserverCallback
   * @param {HTMLElement} statusNode - The node containing the tweet status.
   * @param {string|undefined} statusID - The ID of the tweet/status, if available.
   * @param {string|undefined} username - The username of the creator of the tweet/status.
   */

  /**
   * 
   * @param {statusObserverCallback} callback - The function that will be called when new tweet statuses are added to the DOM.
   */
  constructor(callback: (statusNode: HTMLElement, statusID: string | undefined, username: string | undefined) => void) {
    this.statusCallback = callback;
    this.observer = new MutationObserver(this.mutationCallback.bind(this));
  }

  private mutationCallback(mutationList: MutationRecord[], observer: MutationObserver) {
    const visitedStatusIDs: string[] = [];
    mutationList.forEach((mutation) => {
      mutation.addedNodes.forEach((addedNode) => {
        if (addedNode.nodeType !== Node.ELEMENT_NODE) return;
        const addedElement = addedNode as HTMLElement;
        const articleEl = addedElement.querySelector<HTMLElement>("article") || undefined;
        if (!articleEl) return;

        const statusLink = articleEl.querySelector<HTMLAnchorElement>("a[href*=\"/status/\"]") || undefined;
        //if (!statusLink) return;

        const tweetData = statusLink && extractDataFromStatusLink(statusLink);
        //if (!tweetData) return;

        const statusID = tweetData && tweetData["statusID"];
        if (!visitedStatusIDs.find(id => id == statusID)) {
          this.statusCallback(articleEl, statusID, tweetData && tweetData["username"]);

          statusID && visitedStatusIDs.push(statusID);
        }
      });
    });
  }

  /**
   * Starts observing the DOM.
   */
  public observe() {
    this.observer.observe(document.body, {
      attributes: false,
      childList: true,
      subtree: true
    });
  }

  /**
   * Stops observing the DOM.
   */
  public disconnect() {
    this.observer.disconnect();
  }
}
