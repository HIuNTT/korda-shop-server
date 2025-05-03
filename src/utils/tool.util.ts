export function randomValue(
  size = 16,
  dict = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
) {
  let result = '';
  for (let i = 0; i < size; i++) {
    result += dict.charAt(Math.floor(Math.random() * dict.length));
  }
  return result;
}
