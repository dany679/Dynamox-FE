export function isUUID(uuid: string | null) {
  if (!uuid || typeof uuid !== "string") return false;
  let s = "" + uuid;

  const match = s.match("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");
  if (!match) {
    return false;
  }
  return true;
}
