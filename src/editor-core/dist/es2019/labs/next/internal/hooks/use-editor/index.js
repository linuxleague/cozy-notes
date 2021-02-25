import React from 'react';
import { measureRender, getResponseEndTime, startMeasure, stopMeasure } from '@atlaskit/editor-common';
import measurements from '../../../../../utils/performance/measure-enum';
import { getNodesCount } from '../../../../../utils';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE, PLATFORMS } from '../../../../../plugins/analytics';
import { getEnabledFeatureFlagKeys } from '../../../../../plugins/feature-flags-context/feature-flags-from-props';
import { getFeatureFlags } from '../../../../../plugins/feature-flags-context/';
import { useAnalyticsHandler } from '../use-analytics';
import { createDispatchTransaction } from './create-dispatch-transaction';
import { createEditor } from './create-editor';
import { analyticsEventKey } from '../../../../../plugins/analytics/consts';
export function useEditor(config) {
  startMeasure(measurements.EDITOR_MOUNTED);
  const [editorSharedConfig, mountEditor] = useCreateEditor(config);
  useApplyEditorViewProps(editorSharedConfig, config.disabled);
  useHandleEditorLifecycle(editorSharedConfig);
  useAnalyticsHandler(editorSharedConfig);
  return [editorSharedConfig, mountEditor];
}
/**
 *
 * Sub hooks ¯\_(ツ)_/¯
 *
 */

/**
 * Main hook that creates an instance of EditorView, EditorSharedConfig, etc...
 */

function useCreateEditor(config) {
  const [editorSharedConfig, setEditorSharedConfig] = React.useState(null);
  return [editorSharedConfig, // This callback is being used as `ref={callback}` on EditorContentProvider,
  // When called with `ref` mounts editor and creates editorSharedConfig.
  React.useCallback(ref => {
    // If editorSharedConfig already exists it means that editorView is mounted
    // and we just need to ignore this function altogether.
    if (!ref) {
      return;
    }

    setEditorSharedConfig(editorSharedConfig => {
      if (!editorSharedConfig) {
        measureRender(measurements.PROSEMIRROR_RENDERED, (duration, startTime) => {
          if (sharedConfig && sharedConfig.dispatch) {
            sharedConfig.dispatch(analyticsEventKey, {
              payload: {
                action: ACTION.PROSEMIRROR_RENDERED,
                actionSubject: ACTION_SUBJECT.EDITOR,
                attributes: {
                  duration,
                  startTime,
                  nodes: getNodesCount(sharedConfig.editorView.state.doc),
                  ttfb: getResponseEndTime()
                },
                eventType: EVENT_TYPE.OPERATIONAL
              }
            });
          }
        });
      }

      const sharedConfig = editorSharedConfig || createEditor({ ...config,
        ref
      });
      stopMeasure(measurements.EDITOR_MOUNTED, (duration, startTime) => {
        if (!sharedConfig) {
          return;
        } // Fire editor mounted event


        sharedConfig.dispatch(analyticsEventKey, {
          payload: {
            action: ACTION.EDITOR_MOUNTED,
            actionSubject: ACTION_SUBJECT.EDITOR,
            attributes: {
              duration,
              startTime
            },
            eventType: EVENT_TYPE.OPERATIONAL
          }
        });
      });
      return sharedConfig;
    });
  }, [config])];
}
/**
 * Applies updated EditorView properties e.g. set dispatchTransaction or 'disabled' state changes
 */


function useApplyEditorViewProps(editorSharedConfig, disabled) {
  React.useEffect(() => {
    if (editorSharedConfig) {
      editorSharedConfig.editorView.setProps({
        dispatchTransaction: createDispatchTransaction(editorSharedConfig)
      });
      editorSharedConfig.editorView.setProps({
        editable: _state => !disabled
      });
    }
  }, [editorSharedConfig, disabled]);
}
/**
 * Handles editor component unmount
 */


export function useHandleEditorLifecycle(editorSharedConfig) {
  React.useEffect(() => {
    //#region Did mount
    if (editorSharedConfig) {
      const {
        onMount,
        editorActions,
        editorView,
        eventDispatcher,
        dispatch
      } = editorSharedConfig;

      editorActions._privateRegisterEditor(editorView, eventDispatcher);

      if (onMount) {
        onMount(editorActions);
      }

      const featureFlags = getFeatureFlags(editorSharedConfig.editorView.state);
      const featureFlagsEnabled = featureFlags ? getEnabledFeatureFlagKeys(featureFlags) : []; // Fire editor started event

      dispatch(analyticsEventKey, {
        payload: {
          action: ACTION.STARTED,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: {
            platform: PLATFORMS.WEB,
            featureFlags: featureFlagsEnabled
          },
          eventType: EVENT_TYPE.UI
        }
      });
    } //#endregion


    return () => {
      if (!editorSharedConfig) {
        return;
      }

      const {
        eventDispatcher,
        editorView,
        onDestroy,
        editorActions
      } = editorSharedConfig;

      if (eventDispatcher) {
        eventDispatcher.destroy();
      }

      if (onDestroy) {
        onDestroy();
      }

      editorActions._privateUnregisterEditor();

      if (editorView) {
        // Prevent any transactions from coming through when unmounting
        editorView.setProps({
          dispatchTransaction: _tr => {}
        }); // Destroy plugin states and editor state
        // when the editor is being unmounted

        const editorState = editorView.state;
        editorState.plugins.forEach(plugin => {
          const state = plugin.getState(editorState);

          if (state && state.destroy) {
            state.destroy();
          }
        });
        editorView.destroy();
      }
    };
  }, [editorSharedConfig]);
}