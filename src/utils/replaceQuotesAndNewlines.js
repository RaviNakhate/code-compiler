function replaceQuotesAndNewlines(str) {
  // Replace double quotes with /"
  str = str?.replace(/"/g, '\\"');

  // Replace newlines with \n
  str = str?.replace(/\n/g, "\\n");

  return str;
}

export default replaceQuotesAndNewlines;
