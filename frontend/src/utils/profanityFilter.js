import LeoProfanity from 'leo-profanity'

const filter = LeoProfanity

filter.loadDictionary()

const russianDictionary = [
  'бля', 'пизда', 'хуй', 'ебать', 'хер', 'мудак', 'шлюха',
  'гандон', 'еблан', 'залупа', 'педик', 'сука', 'ебать',
]

filter.add(russianDictionary)

const filterProfanity = (text) => {
  if (typeof text !== 'string') return text
  return filter.clean(text, '*')
}

export default filterProfanity
