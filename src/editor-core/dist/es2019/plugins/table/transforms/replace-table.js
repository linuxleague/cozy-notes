import { TextSelection } from 'prosemirror-state';
import { Slice, Fragment } from 'prosemirror-model';
import { findTable, isTableSelected } from '@atlaskit/editor-tables/utils';
import { addAnalytics, TABLE_ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../analytics';
import { getSelectedTableInfo } from '../utils';
export const replaceSelectedTable = (state, content, inputMethod) => {
  if (isTableSelected(state.selection)) {
    const table = findTable(state.selection);

    if (table) {
      const slice = typeof content === 'string' ? new Slice(Fragment.from(state.schema.text(content)), 0, 0) : content;
      let tr = state.tr.replace(table.pos, table.pos + table.node.nodeSize, slice);
      tr.setSelection(TextSelection.create(tr.doc, table.pos + slice.size + 1));
      const {
        totalRowCount,
        totalColumnCount
      } = getSelectedTableInfo(state.selection);
      addAnalytics(state, tr, {
        action: TABLE_ACTION.REPLACED,
        actionSubject: ACTION_SUBJECT.TABLE,
        attributes: {
          totalColumnCount,
          totalRowCount,
          inputMethod
        },
        eventType: EVENT_TYPE.TRACK
      });
      return tr;
    }
  }

  return state.tr;
};