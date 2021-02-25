import { splitCellWithType } from '@atlaskit/editor-tables/utils';
import { getPluginState } from '../pm-plugins/plugin-factory';

/**
 * We need to split cell keeping the right type of cell given current table configuration.
 * We are using editor-tables splitCellWithType that allows you to choose what cell type should be.
 */
export const splitCell = (state, dispatch) => {
  const tableState = getPluginState(state);
  const {
    tableHeader,
    tableCell
  } = state.schema.nodes;

  if (dispatch) {
    return splitCellWithType(({
      row,
      col
    }) => {
      if (row === 0 && tableState.isHeaderRowEnabled || col === 0 && tableState.isHeaderColumnEnabled) {
        return tableHeader;
      }

      return tableCell;
    })(state, dispatch);
  }

  return true;
};