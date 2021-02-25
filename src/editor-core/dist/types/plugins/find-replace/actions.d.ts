/// <reference types="react" />
import { DecorationSet } from 'prosemirror-view';
import { Match } from './types';
export declare enum FindReplaceActionTypes {
    ACTIVATE = "ACTIVATE",
    FIND = "FIND",
    UPDATE_DECORATIONS = "UPDATE_DECORATIONS",
    FIND_NEXT = "FIND_NEXT",
    FIND_PREVIOUS = "FIND_PREVIOUS",
    REPLACE = "REPLACE",
    REPLACE_ALL = "REPLACE_ALL",
    CANCEL = "CANCEL",
    BLUR = "BLUR",
    UPDATE_FOCUS_ELEMENT = "UPDATE_FOCUS_ELEMENT",
    TOGGLE_MATCH_CASE = "TOGGLE_MATCH_CASE"
}
export interface Activate {
    type: FindReplaceActionTypes.ACTIVATE;
    findText?: string;
    matches?: Match[];
    index?: number;
}
export interface Find {
    type: FindReplaceActionTypes.FIND;
    findText: string;
    matches: Match[];
    index: number;
}
export interface FindNext {
    type: FindReplaceActionTypes.FIND_NEXT;
    index: number;
    decorationSet: DecorationSet;
}
export interface FindPrevious {
    type: FindReplaceActionTypes.FIND_PREVIOUS;
    index: number;
    decorationSet: DecorationSet;
}
export interface Replace {
    type: FindReplaceActionTypes.REPLACE;
    replaceText: string;
    decorationSet: DecorationSet;
    matches: Match[];
    index: number;
}
export interface ReplaceAll {
    type: FindReplaceActionTypes.REPLACE_ALL;
    replaceText: string;
    decorationSet: DecorationSet;
    matches: Match[];
    index: number;
}
export interface Cancel {
    type: FindReplaceActionTypes.CANCEL;
}
export interface Blur {
    type: FindReplaceActionTypes.BLUR;
}
export interface UpdateDecorations {
    type: FindReplaceActionTypes.UPDATE_DECORATIONS;
    decorationSet: DecorationSet;
}
export interface UpdateFocusElement {
    type: FindReplaceActionTypes.UPDATE_FOCUS_ELEMENT;
    focusElementRef: React.RefObject<HTMLElement> | undefined;
}
export interface ToggleMatchCase {
    type: FindReplaceActionTypes.TOGGLE_MATCH_CASE;
}
export declare type FindReplaceAction = Activate | Find | FindNext | FindPrevious | Replace | ReplaceAll | Cancel | Blur | UpdateDecorations | UpdateFocusElement | ToggleMatchCase;
