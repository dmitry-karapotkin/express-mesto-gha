const HTTP_REGEX = /^https?:\/\/(www\.)?[-a-z0-9]{1,256}\.[a-z0-9]{1,6}\b[\w\-/.~:/?#[\]@!$&'()*+,;=]*#?$/i;

module.exports = HTTP_REGEX;
