function convertEscapedCharacters(str) {
  // Convert \n to new line
  str = str?.replace(/\\n/g, "\n");

  // Convert \\" to "
  str = str?.replace(/\\"/g, '"');

  return str;
}

export default convertEscapedCharacters;
