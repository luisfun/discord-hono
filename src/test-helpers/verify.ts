import { verify } from '../verify'

export const testVerifyTrue: typeof verify = async (...rest) => {
  await verify(...rest)
  return true
}
