import type { APIEmbed, APIEmbedField } from 'discord-api-types/v10'

/**
 * [Embed Structure](https://discord.com/developers/docs/resources/message#embed-object)
 */
export class Embed {
  #embed: APIEmbed = {}
  protected a = (embed: APIEmbed) => {
    Object.assign(this.#embed, embed)
    return this
  }
  build = () => this.#embed
  author = (e: APIEmbed['author']) => this.a({ author: e })
  color = (e: APIEmbed['color']) => this.a({ color: e })
  description = (e: APIEmbed['description']) => this.a({ description: e })
  fields = (...e: APIEmbedField[]) => this.a({ fields: e })
  footer = (e: APIEmbed['footer']) => this.a({ footer: e })
  image = (e: APIEmbed['image']) => this.a({ image: e })
  provider = (e: APIEmbed['provider']) => this.a({ provider: e })
  thumbnail = (e: APIEmbed['thumbnail']) => this.a({ thumbnail: e })
  timestamp = (e: APIEmbed['timestamp']) => this.a({ timestamp: e })
  title = (e: APIEmbed['title']) => this.a({ title: e })
  /**
   * @deprecated
   */
  type = (e: APIEmbed['type']) => this.a({ type: e })
  url = (e: APIEmbed['url']) => this.a({ url: e })
  video = (e: APIEmbed['video']) => this.a({ video: e })
}
