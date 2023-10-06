declare class BaseError<T extends string> extends Error {
    code: T;
    cause: any | undefined;
    constructor({ code, message, cause, }: {
        code: T;
        message: string;
        cause?: any;
    });
}
type VerificationErrorCode = 'VERIFICATION_ERROR';
export declare class VerificationError extends BaseError<VerificationErrorCode> {
    constructor(message: string);
}
type PolicyErrorCode = 'UNTRUSTED_SIGNER_ERROR';
export declare class PolicyError extends BaseError<PolicyErrorCode> {
}
export {};
