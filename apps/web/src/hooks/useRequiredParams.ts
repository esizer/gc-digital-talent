import { Params, useParams } from "react-router-dom";
import { useIntl } from "react-intl";

import {
  useLogger,
  defaultLogger,
  type Logger,
} from "@gc-digital-talent/logger";
import { notEmpty } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

import invariant from "~/utils/invariant";

export const uuidRegEx =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export const isUUID = (str: string): boolean => {
  return !!str.match(uuidRegEx);
};

/**
 * Assert Param
 *
 * Ensures that a specific route parameter exists
 * and, optionally check if it is a UUID.
 *
 * @param param
 * @param enforceUUID
 * @param logger
 */
function assertParam(
  param?: string,
  enforceUUID: boolean = true,
  logger: Logger = defaultLogger,
): asserts param is string | never {
  invariant(
    notEmpty(param),
    `Could not find required URL parameter "${param}"`,
    logger,
  );

  if (enforceUUID) {
    invariant(
      isUUID(param),
      `URL parameter "${param}" must be a UUID.`,
      logger,
    );
  }
}

/**
 * Use Required Params
 *
 * Strict version of `useParams` that throws an error
 * if they are undefined (will be caught by router error boundary)
 *
 * @param keys
 * @param enforceUUID
 */
const useRequiredParams = <
  T extends Record<string, string>,
  K extends keyof T = keyof T,
>(
  keys: K | Array<K>,
  enforceUUID: boolean = true,
  message: string | undefined = undefined,
): Record<K, string> => {
  const intl = useIntl();
  const logger = useLogger();
  const params: Params<string> = useParams<T>();
  const keyArray = Array.isArray(keys) ? keys : [keys];
  let nonEmptyParams: Record<K, string> = {} as Record<K, string>;

  nonEmptyParams = keyArray.reduce((reducedParams, key) => {
    const param: string | undefined = params[String(key)];
    let newParams = { ...reducedParams };
    try {
      assertParam(param, enforceUUID, logger);

      if (key) {
        newParams = { ...newParams, [key]: param }; // param must be a string if assertParam didn't throw an error.
      }
    } catch (err) {
      const errorMessage =
        message ?? intl.formatMessage(commonMessages.notFound);
      throw new Response(errorMessage, {
        status: 404,
        statusText: errorMessage,
      });
    }

    return newParams;
  }, nonEmptyParams);

  return nonEmptyParams;
};

export default useRequiredParams;
