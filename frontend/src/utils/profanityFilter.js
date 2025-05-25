import LeoProfanity from 'leo-profanity';

const russianDictionary = [
  'бля', 'пизда', 'хуй', 'ебать', 'хер', 'мудак', 'шлюха', 
  'гандон', 'еблан', 'залупа', 'педик', 'сука', 'ебать',
];

const filter = LeoProfanity;
filter.clearList();
filter.add(russianDictionary);

export const filterProfanity = (text) => {
  if (typeof text !== 'string') return text;
  return filter.clean(text, '*');
};
