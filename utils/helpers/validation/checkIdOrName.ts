export function checkIdOrName(idOrName: string | string[] | undefined): { statusCode: number, message: string, isInvalid: boolean } | { checkedIdOrName: string } {
  idOrName = Array.isArray(idOrName)
    ? idOrName[0]
    : idOrName;

  if (!idOrName || typeof idOrName !== 'string') {
    return { statusCode: 400, message: "Invalid id or name", isInvalid: true };
  }

  return { checkedIdOrName: idOrName }
}