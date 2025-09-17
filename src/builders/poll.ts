import type { APIPartialEmoji, RESTAPIPoll } from 'discord-api-types/v10'
import { Builder } from './utils'

const answersRemap = (answers: (string | [string | APIPartialEmoji, string])[]) =>
  answers.map(e => ({
    poll_media: Array.isArray(e)
      ? { emoji: typeof e[0] === 'string' ? { id: null, name: e[0] } : e[0], text: e[1] }
      : { text: e },
  }))

export class Poll extends Builder<RESTAPIPoll> {
  constructor(question?: string, ...answers: (string | [string | APIPartialEmoji, string])[]) {
    super({ question: { text: question }, answers: answersRemap(answers) })
  }
  /**
   * overwrite question
   * @param {string} question
   * @returns {this}
   */
  question(question: string) {
    return this.a({ question: { text: question } })
  }
  /**
   * overwrite answers
   * @param {string | [string | APIPartialEmoji, string]} answers
   * @returns {this}
   */
  answers(...answers: (string | [string | APIPartialEmoji, string])[]) {
    return this.a({ answers: answersRemap(answers) })
  }
  /**
   * Number of hours the poll should be open for, up to 32 days. Defaults to 24
   * @param {number} duration
   * @returns {this}
   */
  duration(duration = 24) {
    return this.a({ duration })
  }
  /**
   * Whether a user can select multiple answers.
   * @param {boolean} allow_multiselect
   * @returns {this}
   */
  allow_multiselect(allow_multiselect = true) {
    return this.a({ allow_multiselect })
  }
  /**
   * https://discord.com/developers/docs/resources/poll#layout-type
   * @param {number} layout_type
   * @returns {this}
   */
  layout_type(layout_type: number) {
    return this.a({ layout_type })
  }
}
