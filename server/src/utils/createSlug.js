const createSlug = (str, options = {}) => {
  // Default options
  const {
    separator = '-',
    lowercase = true,
    trim = true,
    collapseHyphens = true,
    maxLength = 0,
  } = options;

  if (typeof str !== 'string') {
    return '';
  }

  // Process the string
  let slug = str;

  // Convert to lowercase if enabled
  if (lowercase) {
    slug = slug.toLowerCase();
  }

  // Replace accented characters with their ASCII equivalents
  slug = slug.normalize('NFKD') // Split accented characters into base + accent
    .replace(/[\u0300-\u036f]/g, '') // Remove all the accents

  // Replace special characters with separator or remove them
  slug = slug.replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
    .replace(/\s+/g, separator) // Convert spaces/whitespace to separator
    .replace(/-+/g, separator); // Convert multiple existing hyphens to separator

  // Trim if enabled
  if (trim) {
    slug = slug.replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '');
  }

  // Collapse multiple separators if enabled
  if (collapseHyphens) {
    slug = slug.replace(new RegExp(`${separator}+`, 'g'), separator);
  }

  // Enforce max length if specified
  if (maxLength > 0 && slug.length > maxLength) {
    slug = slug.substring(0, maxLength);
    // Don't end with separator after truncation
    if (slug.endsWith(separator)) {
      slug = slug.substring(0, slug.length - 1);
    }
  }

  // Handle empty string case
  if (slug === '') {
    // If empty after processing but original string wasn't empty,
    // generate something (like a timestamp) to avoid empty slug
    if (str.trim() !== '') {
      slug = 'post-' + Date.now().toString(36);
    }
  }

  return slug;
}

export default createSlug;