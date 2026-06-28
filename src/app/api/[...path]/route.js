/**
 * Next.js Catch-All API Proxy
 *
 * /api/* → http://localhost:5000/api/*
 *
 * এই একটা route দিয়ে সব backend API call forward হয়।
 * auth routes (/api/auth/*) আলাদাভাবে better-auth handle করে,
 * তাই সেগুলো এখানে আসবে না।
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function proxyRequest(request, { params }) {
  const resolvedParams = await params;
  const pathSegments = resolvedParams.path || [];
  const path = pathSegments.join("/");

  // Build the backend URL
  const { search } = new URL(request.url);
  const backendUrl = `${BACKEND_URL}/api/${path}${search}`;

  // Forward all headers except host
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "host") {
      headers.set(key, value);
    }
  });

  // Forward cookies (for session/auth)
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    headers.set("cookie", cookieHeader);
  }

  // Extract session token from cookie and add as Authorization header for backend
  const tokenMatch = cookieHeader?.match(/(?:^|;\s*)(?:auragym\.session_token|better-auth\.session_token|session_token)=([^;]*)/);
  if (tokenMatch && tokenMatch[1]) {
    // If not already set by client, set the Bearer token for backend
    if (!headers.has("authorization")) {
      headers.set("authorization", `Bearer ${tokenMatch[1]}`);
    }
  }

  // For requests with body
  let body = undefined;
  if (!["GET", "HEAD"].includes(request.method)) {
    body = await request.blob();
  }

  try {
    const backendRes = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
      // Don't follow redirects automatically
      redirect: "manual",
    });

    // Forward the response back
    const responseHeaders = new Headers();
    backendRes.headers.forEach((value, key) => {
      // Skip headers that Next.js manages
      if (!["transfer-encoding", "connection"].includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    const responseBody = await backendRes.arrayBuffer();

    return new Response(responseBody, {
      status: backendRes.status,
      statusText: backendRes.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`[Proxy Error] ${request.method} ${backendUrl}:`, error.message);
    return new Response(
      JSON.stringify({ error: "Backend server unreachable", details: error.message }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
