// jest.setup.js

// 1. Polyfill fetch and web APIs
const fetch = require('node-fetch');

global.fetch = fetch;
global.Request = fetch.Request;
global.Response = fetch.Response;
global.Headers = fetch.Headers;
global.ReadableStream =
  global.ReadableStream ||
  require('web-streams-polyfill').ReadableStream;

// 2. Mock next/server
jest.mock('next/server', () => {
  const { Response } = global;

  return {
    NextResponse: class {
      constructor(body, init) {
        return new Response(body, init);
      }

      static json(data, init) {
        return new Response(JSON.stringify(data), {
          ...init,
          headers: {
            'Content-Type': 'application/json',
            ...(init?.headers || {}),
          },
        });
      }

      static redirect(url, init) {
        return new Response(null, {
          status: 307,
          headers: {
            Location: url,
            ...(init?.headers || {}),
          },
        });
      }

      static rewrite(url, init) {
        return new Response(null, {
          status: 307,
          headers: {
            'X-Rewrite-URL': url,
            ...(init?.headers || {}),
          },
        });
      }
    },
    NextRequest: global.Request,
  };
});

// 3. Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
    has: jest.fn(),
    forEach: jest.fn(),
  }),
  usePathname: () => '',
}));

// 4. Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));