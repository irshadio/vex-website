import { codeToHtml } from 'shiki';
import vexGrammar from './vex/vex.tmLanguage.json';
import vexTheme from './vex/theme.json';

/// Returns Vex [code] as highlighted HTML in the brand's code theme.
export function highlight(code: string) {
  return codeToHtml(code, { lang: vexGrammar as never, theme: vexTheme as never });
}
