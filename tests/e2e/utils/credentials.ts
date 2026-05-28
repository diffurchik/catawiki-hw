export type TestUserCredentials = {
  email: string;
  password: string;
};

export function hasTestUserCredentials(): boolean {
  return Boolean(process.env.E2E_USER_EMAIL?.trim() && process.env.E2E_USER_PASSWORD?.trim());
}

export function getTestUserCredentials(): TestUserCredentials {
  const email = process.env.E2E_USER_EMAIL?.trim();
  const password = process.env.E2E_USER_PASSWORD?.trim();

  if (!email || !password) {
    throw new Error('Set E2E_USER_EMAIL and E2E_USER_PASSWORD in .env for authenticated tests.');
  }

  return { email, password };
}
