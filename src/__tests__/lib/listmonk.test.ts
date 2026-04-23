/**
 * @jest-environment node
 */

import {
  createSubscriber,
  findSubscriberByUuid,
  ListmonkError,
  listmonkRequest,
  sendOptInEmail,
  unsubscribeSubscriberFromLists,
} from '@/lib/listmonk';

describe('listmonk client', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn() as jest.Mock;
    process.env.LISTMONK_BASE_URL = 'https://newsletter.project-sentiment.org';
    process.env.LISTMONK_API_USER = 'auth';
    process.env.LISTMONK_API_KEY = 'test-key';
  });

  afterEach(() => {
    delete process.env.LISTMONK_BASE_URL;
    delete process.env.LISTMONK_API_USER;
    delete process.env.LISTMONK_API_KEY;
  });

  it('adds Basic auth header and parses {data}', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ data: { ok: true } }),
    });

    const res = await listmonkRequest<{ ok: boolean }>('/api/health', {
      method: 'GET',
    });

    expect(res).toEqual({ ok: true });
    const [, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(init.headers.Authorization).toMatch(/^Basic\s+/);
    expect(init.headers.Accept).toBe('application/json');
  });

  it('throws ListmonkError with body on non-ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ error: 'boom' }),
      text: async () => 'boom',
    });

    try {
      await listmonkRequest('/api/health');
      throw new Error('Expected listmonkRequest to throw');
    } catch (e) {
      expect(e).toBeInstanceOf(ListmonkError);
      const err = e as ListmonkError;
      expect(err.status).toBe(500);
      expect(err.responseBody).toEqual({ error: 'boom' });
    }
  });

  it('createSubscriber posts expected body', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        data: {
          id: 1,
          uuid: 'u',
          email: 'a@b.c',
          name: 'a@b.c',
          status: 'enabled',
        },
      }),
    });

    await createSubscriber({ email: 'a@b.c', listIds: [1] });

    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(
      'https://newsletter.project-sentiment.org/api/subscribers',
    );
    expect(init.method).toBe('POST');
    const body = JSON.parse(init.body);
    expect(body.email).toBe('a@b.c');
    expect(body.lists).toEqual([1]);
  });

  it('sendOptInEmail calls optin endpoint', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ data: true }),
    });

    await expect(sendOptInEmail(42)).resolves.toBe(true);
    const [url] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toContain('/api/subscribers/42/optin');
  });

  it('findSubscriberByUuid returns first match', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        data: {
          results: [
            {
              id: 7,
              uuid: '11111111-1111-4111-8111-111111111111',
              email: 'x@y.z',
              name: 'x',
              status: 'enabled',
            },
          ],
          total: 1,
        },
      }),
    });

    const sub = await findSubscriberByUuid(
      '11111111-1111-4111-8111-111111111111',
    );
    expect(sub?.id).toBe(7);
  });

  it('findSubscriberByUuid returns null for invalid uuid', async () => {
    const sub = await findSubscriberByUuid("x'); DROP--");
    expect(sub).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('unsubscribeSubscriberFromLists calls /api/subscribers/lists', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ data: true }),
    });

    await unsubscribeSubscriberFromLists({
      subscriberIds: [1],
      targetListIds: [2],
    });

    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toContain('/api/subscribers/lists');
    const body = JSON.parse(init.body);
    expect(body.action).toBe('unsubscribe');
    expect(body.ids).toEqual([1]);
    expect(body.target_list_ids).toEqual([2]);
  });
});
