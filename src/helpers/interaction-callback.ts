import type { APIModalInteractionResponseCallbackData } from 'discord-api-types/v10'

import { $interactions$_$_$callback } from '../rest'
import type { AutocompleteContext, CommandContext, ComponentContext, JsonSerializable, ModalContext } from '../types'
import { toJSON } from '../utils'

export const res202 = <C extends CommandContext | ComponentContext | AutocompleteContext | ModalContext>(
  c?: C,
  handler?: (c: C) => Promise<unknown>,
) => {
  if (c && handler) c.executionCtx.waitUntil(handler(c))
  return new Response(null, { status: 202 })
}

/**
 * Utility function for debugging modal errors.
 * @example
 * export const command = factory.command(
 *   makeSlashCommand(...),
 *   c => {
 *     return res202(c, async c => {
 *       const res = await callbackModal(c, modal.modal)
 *       const debug = await inspectResponse(res)
 *       console.log(debug.text)
 *     })
 *     // return c.resModal(modal.modal)
 *   }
 * )
 * export const modal = factory.modal(...)
 */
export const callbackModal = (
  c: CommandContext | ComponentContext,
  data: JsonSerializable<APIModalInteractionResponseCallbackData>,
) =>
  c.rest('POST', $interactions$_$_$callback, [c.interaction.id, c.interaction.token], {
    type: 9,
    data: toJSON(data),
  })
