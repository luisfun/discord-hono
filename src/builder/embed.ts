import type { APIEmbed, APIEmbedField } from 'discord-api-types/v10'

/**
 * [Embed Structure](https://discord.com/developers/docs/resources/message#embed-object)
 */
export class Embed {
  #embed: APIEmbed = {}
  protected assign = (embed: APIEmbed) => {
    Object.assign(this.#embed, embed)
    return this
  }
  author = (e: APIEmbed['author']) => this.assign({ author: e })
  color = (e: APIEmbed['color']) => this.assign({ color: e })
  description = (e: APIEmbed['description']) => this.assign({ description: e })
  fields = (...e: APIEmbedField[]) => this.assign({ fields: e })
  footer = (e: APIEmbed['footer']) => this.assign({ footer: e })
  image = (e: APIEmbed['image']) => this.assign({ image: e })
  provider = (e: APIEmbed['provider']) => this.assign({ provider: e })
  thumbnail = (e: APIEmbed['thumbnail']) => this.assign({ thumbnail: e })
  timestamp = (e: APIEmbed['timestamp']) => this.assign({ timestamp: e })
  title = (e: APIEmbed['title']) => this.assign({ title: e })
  type = (e: APIEmbed['type']) => this.assign({ type: e })
  url = (e: APIEmbed['url']) => this.assign({ url: e })
  video = (e: APIEmbed['video']) => this.assign({ video: e })
  build = () => this.#embed
}
