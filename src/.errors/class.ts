export type BaseStationErrorCode = "" | "";

export class BaseStationError extends Error {
  readonly code: BaseStationErrorCode;

  constructor(code: BaseStationErrorCode, message?: string) {
    const detail = message ?? code;
    super(`{@sovereignbase/base-station} ${detail}`);
    this.code = code;
    this.name = "BaseStationError";
  }
}
