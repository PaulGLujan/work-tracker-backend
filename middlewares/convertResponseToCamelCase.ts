import { Response, NextFunction } from "express";

function toCamelCase(str: string): string {
  const words = str.split(/[-_]/);
  const capitalizedWords = words.map((word, index) => {
    if (index === 0) {
      return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return capitalizedWords.join("");
}

function convertKeysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamelCase(item));
  } else if (obj !== null && typeof obj === "object") {
    const newObj: any = {};
    for (const key in obj) {
      const value = obj[key];
      const newKey = toCamelCase(key);
      if (value instanceof Date) {
        newObj[newKey] = value;
      } else if (value !== null && typeof value === "object") {
        newObj[newKey] = convertKeysToCamelCase(value);
      } else {
        newObj[newKey] = value;
      }
    }
    return newObj;
  } else {
    return obj;
  }
}

function convertResponseToCamelCase(
  req: any,
  res: Response,
  next: NextFunction
) {
  const originalSend = res.send;
  res.send = function (body: any): Response<any, Record<string, any>> {
    const convertedBody = convertKeysToCamelCase(body);
    return originalSend.call(this, convertedBody);
  };
  next();
}

export default convertResponseToCamelCase;
