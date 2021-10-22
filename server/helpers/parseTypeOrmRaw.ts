import { isPlainObject } from 'lodash';

const rawParser = (
  results: Array<any>,
  result: Record<string, any>,
  primaryAlias: string,
  aliases: Array<string>,
  idColumnName: string,
  arrayAliases: Array<string>,
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
        if (arrayAliases.includes(currentAlias)) {
          parsedResult[currentAlias] = results
            .filter(
              (v) =>
                v[`${primaryAlias}_${idColumnName}`] ===
                result[`${primaryAlias}_${idColumnName}`],
            )
            .reduce(
              (acc, v) => [
                ...acc,
                Object.keys(v)
                  .filter((iv) => iv.startsWith(`${currentAlias}_`))
                  .reduce(
                    (iacc, iv) => ({
                      ...iacc,
                      [iv.replace(`${currentAlias}_`, '')]: v[iv],
                    }),
                    {},
                  ),
              ],
              [],
            )
            .filter((v: any) => !Object.values(v).every((ev) => ev === null));
        } else {
          parsedResult[currentAlias][key.replace(`${currentAlias}_`, '')] =
            result[key];
        }
      }
    }
  });

  aliases.forEach((a) => {
    if (
      isPlainObject(parsedResult[a]) &&
      Object.values(parsedResult[a]).every((v) => v === null)
    )
      parsedResult[a] = null;
  });

  return parsedResult;
};

export const parseRawMany = (
  results: Array<any>,
  primaryAlias: string,
  aliases: Array<string>,
  idColumnName: string,
  arrayAliases: Array<string>,
) => {
  const parsedResult: Array<any> = [];

  results.forEach((result) => {
    if (
      parsedResult.findIndex(
        (v) => v[idColumnName] === result[`${primaryAlias}_${idColumnName}`],
      ) >= 0
    )
      return;

    parsedResult.push(
      rawParser(
        results,
        result,
        primaryAlias,
        aliases,
        idColumnName,
        arrayAliases,
      ),
    );
  });

  return parsedResult;
};

export const parseRawOne = (
  result: Record<string, any>,
  primaryAlias: string,
  aliases: Array<string>,
  idColumnName: string,
  arrayAliases: Array<string>,
) =>
  rawParser(
    [result],
    result,
    primaryAlias,
    aliases,
    idColumnName,
    arrayAliases,
  );
