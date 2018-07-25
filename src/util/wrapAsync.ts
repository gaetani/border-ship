import * as core from "express-serve-static-core";

/**
 * Wrap async function, in order to catch error and call the correct middleware.
 * @param fn
 * @returns {(req: Request, res: Response, next: NextFunction) => void}
 */
const wrapAsync = (fn: any) => {
  return (req: core.Request, res: core.Response, next: core.NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default wrapAsync;
