import { describe, expect, it } from 'vitest'
import { makePoll, makePollAnswer, makePollMedia } from './poll'

describe('a-poll builders', () => {
  it('should initialize with a question and answers', () => {
    const poll = makePoll('Favorite color?', ['Red', 'Blue', 'Green'])

    expect(poll.toJSON()).toEqual({
      question: { text: 'Favorite color?' },
      answers: [{ poll_media: { text: 'Red' } }, { poll_media: { text: 'Blue' } }, { poll_media: { text: 'Green' } }],
    })
  })

  it('should overwrite the question', () => {
    const poll = makePoll('Initial question', ['Answer 1']).question(makePollMedia('Updated question'))

    expect(poll.toJSON().question).toEqual({ text: 'Updated question' })
  })

  it('should overwrite the answers', () => {
    const poll = makePoll('Question', ['Answer 1']).answers([
      makePollAnswer(makePollMedia('Answer 2')),
      makePollAnswer(makePollMedia('Answer 3')),
    ])

    expect(poll.toJSON().answers).toEqual([{ poll_media: { text: 'Answer 2' } }, { poll_media: { text: 'Answer 3' } }])
  })

  it('should set the duration', () => {
    const poll = makePoll('Question', ['Answer 1']).duration(48)

    expect(poll.toJSON().duration).toBe(48)
  })

  it('should allow multiselect', () => {
    const poll = makePoll('Question', ['Answer 1']).allow_multiselect(true)

    expect(poll.toJSON().allow_multiselect).toBe(true)
  })

  it('should set the layout type', () => {
    const poll = makePoll('Question', ['Answer 1']).layout_type(1)

    expect(poll.toJSON().layout_type).toBe(1)
  })

  it('should handle emoji answers', () => {
    const poll = makePoll('Question', [
      ['😊', 'Happy'],
      ['😄', 'Excited'],
    ])

    expect(poll.toJSON().answers).toEqual([
      { poll_media: { emoji: { id: null, name: '😊' }, text: 'Happy' } },
      { poll_media: { emoji: { id: null, name: '😄' }, text: 'Excited' } },
    ])
  })

  it('should create poll media with emoji and text', () => {
    expect(makePollMedia(['😊', 'Happy']).toJSON()).toEqual({ emoji: { id: null, name: '😊' }, text: 'Happy' })
  })
})
