import { customAlphabet } from 'nanoid';

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

export function generateRandomValue(
  size?: number,
  placeholder = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM',
): string {
  const customNanoid = customAlphabet(placeholder, size);
  return customNanoid();
}

/** Xóa 1 list thuộc tính khỏi đối tượng
 * @param data Đối tượng cần xóa thuộc tính
 * @param keys Danh sách thuộc tính cần xóa của đối tượng
 */
export function deleteFields<TData, TKey extends keyof TData>(data: TData, keys: TKey[]) {
  for (let key of keys) {
    delete data[key];
  }
}
