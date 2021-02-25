import { Plugin } from 'prosemirror-state';
import rafSchedule from 'raf-schd';
import reducer from './reducers';
import { pluginKey } from './plugin-key';
import { handleProvider, resolveWithProvider } from './util/resolve';
import { getNewRequests, getPluginState, getPluginStateWithUpdatedPos } from './util/state';
import { EmbedCard } from '../nodeviews/embedCard';
import { BlockCard } from '../nodeviews/blockCard';
import { InlineCard } from '../nodeviews/inlineCard';
export { pluginKey } from './plugin-key';
export const createPlugin = (platform, allowResizing, fullWidthMode) => ({
  portalProviderAPI,
  eventDispatcher,
  providerFactory,
  dispatchAnalyticsEvent
}) => {
  const reactComponentProps = {
    eventDispatcher,
    providerFactory,
    platform,
    allowResizing,
    fullWidthMode,
    dispatchAnalyticsEvent
  };
  return new Plugin({
    state: {
      init() {
        return {
          requests: [],
          provider: null,
          cards: [],
          showLinkingToolbar: false
        };
      },

      apply(tr, pluginState) {
        // Update all the positions of outstanding requests and
        // cards in the plugin state.
        const pluginStateWithUpdatedPos = getPluginStateWithUpdatedPos(pluginState, tr); // apply any actions

        const meta = tr.getMeta(pluginKey);

        if (meta) {
          const nextPluginState = reducer(pluginStateWithUpdatedPos, meta);
          return nextPluginState;
        }

        return pluginStateWithUpdatedPos;
      }

    },

    view(view) {
      const outstandingRequests = {};

      const subscriptionHandler = (name, provider) => handleProvider(name, provider, view);

      const rafCancellationCallbacks = [];
      providerFactory.subscribe('cardProvider', subscriptionHandler);
      return {
        update(view, prevState) {
          const currentState = getPluginState(view.state);
          const oldState = getPluginState(prevState);

          if (currentState && currentState.provider) {
            // Find requests in this state that weren't in the old one.
            const newRequests = getNewRequests(oldState, currentState); // Ask the CardProvider to resolve all new requests.

            const {
              provider
            } = currentState;
            newRequests.forEach(request => {
              /**
               * Queue each asynchronous resolve request on separate frames.
               * ---
               * NB: The promise for each request is queued to take place on separate animation frames. This avoids
               * the scenario debugged and discovered in EDM-668, wherein the queuing of too many promises in quick succession
               * leads to the browser's macrotask queue being overwhelmed, locking interactivity of the browser tab.
               * By using this approach, the browser is free to schedule the resolution of the promises below in between rendering/network/
               * other tasks as per common implementations of the JavaScript event loop in browsers.
               */
              const invoke = rafSchedule(() => resolveWithProvider(view, outstandingRequests, provider, request));
              rafCancellationCallbacks.push(invoke.cancel);
              invoke();
            });
          }
        },

        destroy() {
          // Cancel all outstanding requests
          Object.keys(outstandingRequests).forEach(url => Promise.reject(outstandingRequests[url])); // Cancel any outstanding raf callbacks.

          rafCancellationCallbacks.forEach(cancellationCallback => cancellationCallback());
          providerFactory.unsubscribe('cardProvider', subscriptionHandler);
        }

      };
    },

    props: {
      nodeViews: {
        inlineCard: (node, view, getPos) => new InlineCard(node, view, getPos, portalProviderAPI, eventDispatcher, reactComponentProps, undefined, true).init(),
        blockCard: (node, view, getPos) => new BlockCard(node, view, getPos, portalProviderAPI, eventDispatcher, reactComponentProps, undefined, true).init(),
        embedCard: (node, view, getPos) => new EmbedCard(node, view, getPos, portalProviderAPI, eventDispatcher, reactComponentProps, undefined, true).init()
      }
    },
    key: pluginKey
  });
};