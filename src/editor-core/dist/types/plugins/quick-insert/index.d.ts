import { InjectedIntl } from 'react-intl';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { EditorPlugin } from '../../types';
import { pluginKey } from './plugin-key';
import { QuickInsertHandler, QuickInsertPluginOptions, QuickInsertPluginState } from './types';
export type { QuickInsertHandler, QuickInsertPluginState, QuickInsertPluginOptions, };
export { pluginKey };
declare const quickInsertPlugin: (options?: QuickInsertPluginOptions | undefined) => EditorPlugin;
export default quickInsertPlugin;
export declare const processItems: (items: Array<QuickInsertHandler>, intl: InjectedIntl) => QuickInsertItem[];
