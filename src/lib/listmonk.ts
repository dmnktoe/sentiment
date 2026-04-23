type ListmonkJson<T> = { data: T };

export class ListmonkError extends Error {
  public readonly status: number;
  public readonly responseBody: unknown;

  constructor(message: string, status: number, responseBody: unknown) {
    super(message);
    this.name = 'ListmonkError';
    this.status = status;
    this.responseBody = responseBody;
  }
}

function getRequiredEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getListmonkConfig() {
  // Read directly from process.env to avoid import-time capture of env values.
  // This makes runtime configuration and tests (which set env per test) reliable.
  const baseUrl = getRequiredEnv(
    'LISTMONK_BASE_URL',
    process.env.LISTMONK_BASE_URL,
  ).replace(/\/+$/, '');
  const apiUser = getRequiredEnv(
    'LISTMONK_API_USER',
    process.env.LISTMONK_API_USER,
  );
  const apiKey = getRequiredEnv(
    'LISTMONK_API_KEY',
    process.env.LISTMONK_API_KEY,
  );

  return { baseUrl, apiUser, apiKey };
}

function getAuthHeader(): string {
  const { apiUser, apiKey } = getListmonkConfig();
  const token = Buffer.from(`${apiUser}:${apiKey}`, 'utf8').toString('base64');
  return `Basic ${token}`;
}

async function parseJsonBestEffort(res: Response): Promise<unknown> {
  const ct = res.headers.get('content-type') ?? '';
  if (ct.includes('application/json')) {
    return res.json().catch(() => undefined);
  }
  return res.text().catch(() => undefined);
}

export async function listmonkRequest<T>(
  path: string,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<T> {
  const { baseUrl } = getListmonkConfig();
  const url = `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;

  const controller = new AbortController();
  const timeoutMs = init.timeoutMs ?? 10_000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : undefined),
        Authorization: getAuthHeader(),
        ...(init.headers ?? {}),
      },
    });

    if (!res.ok) {
      const body = await parseJsonBestEffort(res);
      throw new ListmonkError(
        `Listmonk request failed: ${res.status} ${res.statusText}`,
        res.status,
        body,
      );
    }

    const json = (await res.json()) as ListmonkJson<T>;
    return json.data;
  } finally {
    clearTimeout(timeoutId);
  }
}

export interface ListmonkSubscriber {
  id: number;
  uuid: string;
  email: string;
  name: string;
  status: 'enabled' | 'disabled' | 'blocklisted';
  lists?: unknown;
}

export async function createSubscriber(params: {
  email: string;
  name?: string;
  listIds: number[];
}): Promise<ListmonkSubscriber> {
  return listmonkRequest<ListmonkSubscriber>('/api/subscribers', {
    method: 'POST',
    body: JSON.stringify({
      email: params.email,
      name: params.name ?? params.email,
      status: 'enabled',
      lists: params.listIds,
    }),
  });
}

export async function sendOptInEmail(subscriberId: number): Promise<boolean> {
  const result = await listmonkRequest<boolean>(
    `/api/subscribers/${subscriberId}/optin`,
    { method: 'POST', body: JSON.stringify({}) },
  );
  return Boolean(result);
}

export async function findSubscriberByUuid(
  uuid: string,
): Promise<ListmonkSubscriber | null> {
  const query = encodeURIComponent(`subscribers.uuid = '${uuid}'`);
  const data = await listmonkRequest<{
    results: ListmonkSubscriber[];
    total: number;
  }>(`/api/subscribers?query=${query}&page=1&per_page=100`);

  const match = data.results?.[0];
  return match ?? null;
}

export async function unsubscribeSubscriberFromLists(params: {
  subscriberIds: number[];
  targetListIds: number[];
}): Promise<boolean> {
  const ok = await listmonkRequest<boolean>('/api/subscribers/lists', {
    method: 'PUT',
    body: JSON.stringify({
      ids: params.subscriberIds,
      action: 'unsubscribe',
      target_list_ids: params.targetListIds,
    }),
  });
  return Boolean(ok);
}
