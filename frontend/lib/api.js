const API_URL = "https://my-market-platform.onrender.com/api";

export async function apiGet(path, token) {
  const res = await fetch(API_URL + path, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("API GET failed");
  return res.json();
}

export async function apiPost(path, body, token) {
  const res = await fetch(API_URL + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("API POST failed");
  return res.json();
}
