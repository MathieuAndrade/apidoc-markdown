/**
 * Convert a title to a Markdown-valid relative link
 * @param str Title to convert
 * @returns The valid linkable string
 */
const toLink = (str) => str.replace(/\s+/g, '-')

module.exports = {
    toLink
}
