/**
 * Formats rich text or plain text content from CMS.
 * Automatically wraps plain text blocks/paragraphs separated by newlines (\n\n) into <p> tags,
 * converts single newlines (\n) to <br />, and preserves existing HTML tags cleanly.
 */
export function formatRichText(content) {
  if (!content || typeof content !== 'string') return '';

  const trimmed = content.trim();
  if (!trimmed) return '';

  const hasHtml = /<[a-z][\s\S]*>/i.test(trimmed);

  if (!hasHtml) {
    return trimmed
      .split(/\r?\n\r?\n+/)
      .map(para => `<p>${para.replace(/\r?\n/g, '<br />')}</p>`)
      .join('');
  }

  // If content has HTML tags, split by double newlines (\n\n)
  // and process sections that aren't wrapped in HTML block tags.
  const blocks = trimmed.split(/\r?\n\r?\n+/);
  const blockTagRegex = /^<(p|h[1-6]|ul|ol|li|blockquote|div|section|table|figure|article|header|footer)\b/i;

  return blocks
    .map((block) => {
      const bTrimmed = block.trim();
      if (!bTrimmed) return '';
      if (blockTagRegex.test(bTrimmed)) {
        return bTrimmed;
      }
      if (/^<img\b/i.test(bTrimmed)) {
        return bTrimmed;
      }
      return `<p>${bTrimmed.replace(/\r?\n/g, '<br />')}</p>`;
    })
    .join('');
}
