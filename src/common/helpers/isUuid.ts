import { validate as uuidValidate } from 'uuid';

export function isUuid(id: string) {
  if (uuidValidate(id)) {
    return true;
  } else {
    return false;
  }
}
