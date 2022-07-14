function themeParser(obj, parentKey) {
  parentKey = parentKey || null;
  const keys = Object.keys(obj);
  var returnDict = {};
  keys.forEach((key) => {
    const val = obj[key];
    if (typeof val === 'object') {
      const parsedDict = themeParser(val, key);
      const parsedDictKeys = Object.keys(parsedDict);
      parsedDictKeys.forEach((key) => {
        returnDict[(parentKey ? parentKey + '-' : '--') + key] = parsedDict[key];
      });
    } else {
      returnDict[(parentKey ? parentKey + '-' : '--') + key] = val;
    }
  });
  return returnDict;
}

export default themeParser;
