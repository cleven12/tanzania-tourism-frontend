import { marked, Renderer } from 'marked';

const renderer = new Renderer();
// Escape any raw HTML in the source so rendered output is safe.
renderer.html = ({ text }) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const baseLink = renderer.link.bind(renderer);
renderer.link = (token) => (/^\s*(javascript|data|vbscript):/i.test(token.href) ? token.text : baseLink(token));
renderer.image = ({ text }) => text;

export function renderRichtext(src: string | null | undefined): string {
	if (!src) return '';
	return marked.parse(src, { renderer, async: false, gfm: true, breaks: false }) as string;
}
