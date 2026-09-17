import sanitizeHtml from 'sanitize-html';

// Server-side allowlist for rich text saved from the admin's Tiptap editor
// (RichTextEditor.tsx: bold/italic/underline/strike, lists, links). The
// editor's UI can't produce anything outside this on its own, but a Server
// Action can be called directly with hand-crafted HTML bypassing the editor
// entirely — this is the real enforcement boundary, applied on write so
// nothing unsafe ever reaches the DB (and every dangerouslySetInnerHTML
// render site) in the first place.
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'ul', 'ol', 'li', 'a', 'blockquote'],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
  },
};

export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, OPTIONS);
}

// The block-based page builder stores block data as opaque JSON (any of the
// BlockData union's shapes), so unlike the dedicated columns above there's no
// single place to hook sanitization in — it has to walk the data by type.
// Only 'textSections' currently has a rich-text field (sections[].text,
// rendered via dangerouslySetInnerHTML in TextSectionsBlock.tsx); add more
// cases here if another block type grows one.
export function sanitizeBlockData(type: string, data: unknown): unknown {
  if (type !== 'textSections' || !data || typeof data !== 'object') return data;
  const d = data as { sections?: Array<{ text?: string }> };
  if (!Array.isArray(d.sections)) return data;
  return {
    ...d,
    sections: d.sections.map((s) => (typeof s?.text === 'string' ? { ...s, text: sanitizeRichText(s.text) } : s)),
  };
}
