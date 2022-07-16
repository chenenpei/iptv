export const cx = (arr: string[]) => {
  return arr.filter((item) => item).join(" ");
};

export const fetchWithTimeout = async(
  resource: string,
  options: RequestInit & { timeout?: number } = {}
) => {
  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}
