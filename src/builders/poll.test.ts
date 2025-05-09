import { describe, expect, it } from 'vitest'
import { Poll } from './poll'

describe('Poll', () => {
  it('should initialize with a question and answers', () => {
    const poll = new Poll('Favorite color?', 'Red', 'Blue', 'Green')
    expect(poll.toJSON()).toEqual({
      question: { text: 'Favorite color?' },
      answers: [{ poll_media: { text: 'Red' } }, { poll_media: { text: 'Blue' } }, { poll_media: { text: 'Green' } }],
    })
  })

  it('should overwrite the question', () => {
    const poll = new Poll('Initial question').question('Updated question')
    expect(poll.toJSON().question).toEqual({ text: 'Updated question' })
  })

  it('should overwrite the answers', () => {
    const poll = new Poll('Question', 'Answer 1').answers('Answer 2', 'Answer 3')
    expect(poll.toJSON().answers).toEqual([{ poll_media: { text: 'Answer 2' } }, { poll_media: { text: 'Answer 3' } }])
  })

  it('should set the duration', () => {
    const poll = new Poll('Question').duration(48)
    expect(poll.toJSON().duration).toBe(48)
  })

  it('should allow multiselect', () => {
    const poll = new Poll('Question').allow_multiselect(true)
    expect(poll.toJSON().allow_multiselect).toBe(true)
  })

  it('should set the layout type', () => {
    const poll = new Poll('Question').layout_type(2)
    expect(poll.toJSON().layout_type).toBe(2)
  })

  it('should handle emoji answers', () => {
    const emoji = { id: '123', name: 'smile' }
    const poll = new Poll('Question', ['😊', 'Happy'], [emoji, 'Excited'])
    expect(poll.toJSON().answers).toEqual([
      { poll_media: { emoji: { id: null, name: '😊' }, text: 'Happy' } },
      { poll_media: { emoji: { id: '123', name: 'smile' }, text: 'Excited' } },
    ])
  })
})
