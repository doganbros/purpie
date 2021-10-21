const rawParser = (
  result: Record<string, any>,
  primaryAlias: string,
  aliases: Array<string>,
) => {
  const keys = Object.keys(result);
  const parsedResult: Record<string, any> = {};

  keys.forEach((key) => {
    if (key.startsWith(`${primaryAlias}_`)) {
      parsedResult[key.replace(`${primaryAlias}_`, '')] = result[key];
    } else {
      const currentAlias = aliases.find((a) => key.startsWith(`${a}_`));

      if (currentAlias) {
        if (!parsedResult[currentAlias]) parsedResult[currentAlias] = {};
        parsedResult[currentAlias][key.replace(`${currentAlias}_`, '')] =
          result[key];
      }
    }
  });
  return parsedResult;
};

export const parseRawMany = (
  results: Array<any>,
  primaryAlias: string,
  aliases: Array<string>,
) => results.map((result) => rawParser(result, primaryAlias, aliases));

export const parseRawOne = (
  result: Record<string, any>,
  primaryAlias: string,
  aliases: Array<string>,
) => rawParser(result, primaryAlias, aliases);
