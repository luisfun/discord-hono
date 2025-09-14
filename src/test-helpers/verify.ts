import { verify } from '../verify'

/**
 * verify that always returns `true`.
 * @param rest
 * @returns {true}
 */
export const testVerifyTrue = async (...rest: Parameters<typeof verify>): Promise<true> => {
  await verify(...rest)
  return true
}
