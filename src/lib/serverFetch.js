'use server';
import { headers } from "next/headers";
import fetchSecure from './fetchSecure';
import { auth } from "@/lib/auth";

const baseUrl = "http://localhost:3000";

const handleStatus = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
  }
  return res.json();
};

export const getTokenServer = async () => {
  const { data } = await auth.api.getToken({
    headers: await headers(),
  });
  return data?.token || null;  // ← .token যুক্ত করো
};

export const protectedServerFetch = async (path, options = {}) => {
  const token = await getTokenServer();

  const res = await fetchSecure(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return handleStatus(res);
};
