import type { verify } from '../verify'

/**
 * verify that always returns `true`.
 * @param rest
 * @returns
 */
export const testVerifyTrue = async (..._rest: Parameters<typeof verify>): Promise<true> => true
