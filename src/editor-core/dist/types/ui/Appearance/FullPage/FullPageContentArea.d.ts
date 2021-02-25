import { ProviderFactory } from '@atlaskit/editor-common';
import { EditorView } from 'prosemirror-view';
import React, { ReactElement } from 'react';
import EditorActions from '../../../actions';
import { EventDispatcher } from '../../../event-dispatcher';
import { ReactComponents, EditorAppearance, UIComponentFactory } from '../../../types';
import { DispatchAnalyticsEvent } from '../../../plugins/analytics';
interface FullPageEditorContentAreaProps {
    allowAnnotation: boolean | undefined;
    appearance: EditorAppearance | undefined;
    contentArea: HTMLElement | undefined;
    contentComponents: UIComponentFactory[] | undefined;
    contextPanel: ReactComponents | undefined;
    customContentComponents: ReactComponents | undefined;
    disabled: boolean | undefined;
    dispatchAnalyticsEvent: DispatchAnalyticsEvent | undefined;
    editorActions: EditorActions | undefined;
    editorDOMElement: ReactElement;
    editorView: EditorView;
    eventDispatcher: EventDispatcher | undefined;
    popupsMountPoint: HTMLElement | undefined;
    popupsBoundariesElement: HTMLElement | undefined;
    popupsScrollableElement: HTMLElement | undefined;
    providerFactory: ProviderFactory;
    scrollContainer: HTMLElement | null;
    contentAreaRef(ref: HTMLElement | null): void;
    scrollContainerRef(ref: HTMLElement | null): void;
}
export declare const FullPageContentArea: React.FunctionComponent<FullPageEditorContentAreaProps>;
export {};
