// This script runs in a disposable Worker so expensive patterns can be stopped.
self.onmessage = ({data}) => {
  try {
    const {pattern, flags, input, replacement} = data;
    if (pattern.length > 500 || input.length > 20000 || replacement.length > 500 || !/^[gimsu]*$/.test(flags) || new Set(flags).size !== flags.length) throw new Error('LIMIT');
    const re = new RegExp(pattern, flags);
    const matches = [];
    const found = flags.includes('g') ? input.matchAll(re) : [re.exec(input)].filter(Boolean);
    for (const match of found) {
      matches.push({index: match.index, value: match[0], captures: match.slice(1), groups: match.groups || {}});
      if (matches.length >= 200) break;
    }
    const substituted = replacement ? input.replace(re, replacement) : '';
    if (substituted.length > 50000) throw new Error('LIMIT');
    self.postMessage({matches, substituted, truncated: matches.length === 200});
  } catch (error) {
    self.postMessage({error: String(error.message || error)});
  }
};
