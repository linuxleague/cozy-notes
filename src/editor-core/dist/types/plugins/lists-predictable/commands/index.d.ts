import { ResolvedPos, NodeType } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { Command } from '../../../types';
import { INPUT_METHOD } from '../../analytics';
import { outdentList } from './outdent-list';
import { indentList } from './indent-list';
export { outdentList, indentList };
declare type InputMethod = INPUT_METHOD.KEYBOARD | INPUT_METHOD.TOOLBAR;
export declare const enterKeyCommand: Command;
export declare const backspaceKeyCommand: Command;
export declare const deleteKeyCommand: Command;
export declare const rootListDepth: (pos: ResolvedPos, nodes: Record<string, NodeType>) => number | undefined;
export declare function toggleList(inputMethod: InputMethod, listType: 'bulletList' | 'orderedList'): Command;
export declare function toggleBulletList(view: EditorView, inputMethod?: InputMethod): boolean;
export declare function toggleOrderedList(view: EditorView, inputMethod?: InputMethod): boolean;
export declare function wrapInList(nodeType: NodeType): Command;
