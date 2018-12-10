/**
 * The result of user doing warn, message or fail, built this way for
 * expansion later.
 */
export interface Violation {
    /** The string representation */
    message: string;
    /** Optional path to the file */
    file?: string;
    /** Optional line in the file */
    line?: number;
}
export declare const isInline: (violation: Violation) => boolean;
