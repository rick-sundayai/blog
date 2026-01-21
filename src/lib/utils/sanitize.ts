import DOMPurify from 'isomorphic-dompurify'
import { marked } from 'marked'

// Configure marked for safe output
marked.setOptions({
  gfm: true,
  breaks: true,
})

/**
 * Sanitizes HTML content, stripping dangerous tags and attributes
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''
  
  // DOMPurify configuration - allow common blog formatting
  const config = {
    ALLOWED_TAGS: [
      // Text formatting
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del', 'ins',
      'mark', 'small', 'sub', 'sup',
      // Headings
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      // Lists
      'ul', 'ol', 'li',
      // Links and media
      'a', 'img',
      // Code
      'pre', 'code', 'kbd', 'samp',
      // Quotes and blocks
      'blockquote', 'q', 'cite',
      // Tables
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
      // Structure
      'div', 'span', 'hr',
      // Definition lists
      'dl', 'dt', 'dd',
      // Details/summary
      'details', 'summary',
      // Figure
      'figure', 'figcaption',
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id',
      'target', 'rel',
      'width', 'height',
      'colspan', 'rowspan',
      'loading',
    ],
    ALLOW_DATA_ATTR: false,
    RETURN_TRUSTED_TYPE: false,
  }

  return DOMPurify.sanitize(html, config) as string
}

/**
 * Converts markdown to sanitized HTML
 * Handles both markdown and pre-existing HTML content
 */
export async function markdownToSafeHtml(content: string): Promise<string> {
  if (!content) return ''

  // Check if content looks like HTML (starts with a tag)
  const isLikelyHtml = content.trim().startsWith('<')

  if (isLikelyHtml) {
    // Just sanitize existing HTML
    return sanitizeHtml(content)
  }

  // Convert markdown to HTML, then sanitize
  const rawHtml = await marked.parse(content)
  return sanitizeHtml(rawHtml)
}

