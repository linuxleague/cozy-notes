import { PluginKey } from 'prosemirror-state';
import { inlineCard, blockCard, embedCard } from '@atlaskit/adf-schema';
import { createPlugin } from './pm-plugins/main';
import { floatingToolbar } from './toolbar';
export const stateKey = new PluginKey('cardPlugin');

const cardPlugin = options => {
  return {
    name: 'card',

    nodes() {
      const nodes = [{
        name: 'inlineCard',
        node: inlineCard
      }, {
        name: 'blockCard',
        node: blockCard
      }];

      if (options.allowEmbeds) {
        nodes.push({
          name: 'embedCard',
          node: embedCard
        });
      }

      return nodes;
    },

    pmPlugins() {
      const allowResizing = typeof options.allowResizing === 'boolean' ? options.allowResizing : true;
      return [{
        name: 'card',
        plugin: createPlugin(options.platform, allowResizing, options.fullWidthMode)
      }];
    },

    pluginsOptions: {
      floatingToolbar: floatingToolbar(options, options.platform)
    }
  };
};

export default cardPlugin;