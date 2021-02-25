import React from 'react';
import { createPlugin, getPluginState } from './plugin';
import { findReplacePluginKey } from './types';
import keymapPlugin from './keymap';
import WithPluginState from '../../ui/WithPluginState';
import { cancelSearchWithAnalytics, replaceWithAnalytics, replaceAllWithAnalytics, findWithAnalytics, findNextWithAnalytics, findPrevWithAnalytics, activateWithAnalytics } from './commands-with-analytics';
import { blur, updateFocusElementRef, toggleMatchCase } from './commands';
import FindReplaceToolbarButton from './ui/FindReplaceToolbarButton';
import { TRIGGER_METHOD } from '../analytics';
import { getFeatureFlags } from '../feature-flags-context';
export const findReplacePlugin = () => {
  return {
    name: 'findReplace',

    pmPlugins() {
      return [{
        name: 'findReplace',
        plugin: ({
          dispatch
        }) => createPlugin(dispatch)
      }, {
        name: 'findReplaceKeymap',
        plugin: () => keymapPlugin()
      }];
    },

    primaryToolbarComponent({
      popupsBoundariesElement,
      popupsMountPoint,
      popupsScrollableElement,
      isToolbarReducedSpacing,
      editorView,
      containerElement,
      dispatchAnalyticsEvent
    }) {
      // we need the editor to be in focus for scrollIntoView() to work
      // so we focus it while we run the command, then put focus back into
      // whatever element was previously focused in find replace component
      const runWithEditorFocused = fn => {
        editorView.focus();
        fn();
        const {
          focusElementRef
        } = getPluginState(editorView.state);

        if (focusElementRef && focusElementRef.current) {
          focusElementRef.current.focus();
        }
      };

      const dispatchCommand = cmd => {
        const {
          state,
          dispatch
        } = editorView;
        cmd(state, dispatch);
      };

      const handleActivate = () => {
        runWithEditorFocused(() => dispatchCommand(activateWithAnalytics({
          triggerMethod: TRIGGER_METHOD.TOOLBAR
        })));
      };

      const handleFind = keyword => {
        runWithEditorFocused(() => dispatchCommand(findWithAnalytics({
          editorView,
          containerElement,
          keyword
        })));
      };

      const handleFindNext = ({
        triggerMethod
      }) => {
        runWithEditorFocused(() => dispatchCommand(findNextWithAnalytics({
          triggerMethod
        })));
      };

      const handleFindPrev = ({
        triggerMethod
      }) => {
        runWithEditorFocused(() => dispatchCommand(findPrevWithAnalytics({
          triggerMethod
        })));
      };

      const handleReplace = ({
        triggerMethod,
        replaceText
      }) => {
        runWithEditorFocused(() => dispatchCommand(replaceWithAnalytics({
          triggerMethod,
          replaceText
        })));
      };

      const handleReplaceAll = ({
        replaceText
      }) => {
        runWithEditorFocused(() => dispatchCommand(replaceAllWithAnalytics({
          replaceText
        })));
      };

      const handleFindBlur = () => {
        dispatchCommand(blur());
      };

      const handleCancel = ({
        triggerMethod
      }) => {
        dispatchCommand(cancelSearchWithAnalytics({
          triggerMethod
        }));
        editorView.focus();
      };

      const handleFocusElementRefSet = ref => {
        dispatchCommand(updateFocusElementRef(ref));
      };

      const handleToggleMatchCase = () => {
        dispatchCommand(toggleMatchCase());
      };

      const {
        findReplaceMatchCase
      } = getFeatureFlags(editorView.state);
      return /*#__PURE__*/React.createElement(WithPluginState, {
        plugins: {
          findReplaceState: findReplacePluginKey
        },
        render: ({
          findReplaceState
        }) => {
          return /*#__PURE__*/React.createElement(FindReplaceToolbarButton, {
            allowMatchCase: findReplaceMatchCase,
            shouldMatchCase: findReplaceState.shouldMatchCase,
            onToggleMatchCase: handleToggleMatchCase,
            isActive: findReplaceState.isActive,
            findText: findReplaceState.findText,
            index: findReplaceState.index,
            numMatches: findReplaceState.matches.length,
            replaceText: findReplaceState.replaceText,
            shouldFocus: findReplaceState.shouldFocus,
            popupsBoundariesElement: popupsBoundariesElement,
            popupsMountPoint: popupsMountPoint,
            popupsScrollableElement: popupsScrollableElement,
            isReducedSpacing: isToolbarReducedSpacing,
            dispatchAnalyticsEvent: dispatchAnalyticsEvent,
            onFindBlur: handleFindBlur,
            onCancel: handleCancel,
            onActivate: handleActivate,
            onFind: handleFind,
            onFindNext: handleFindNext,
            onFindPrev: handleFindPrev,
            onReplace: handleReplace,
            onReplaceAll: handleReplaceAll,
            onFocusElementRefSet: handleFocusElementRefSet
          });
        }
      });
    }

  };
};
export default findReplacePlugin;