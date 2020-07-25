import { Treat, TreatInput } from "./types";

async function request<T>(...fetchParams: Parameters<typeof fetch>) {
  const res = await fetch(...fetchParams);
  const data = await res.json();
  if (res.ok) {
    return data as T;
  } else {
    throw new Error(data);
  }
}

async function post<T>(url: string, json: any): Promise<T> {
  return request<T>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  });
}

export async function getTreats(): Promise<Array<Treat>> {
  return request("/api/treat");
}

export async function createTreat(input: TreatInput): Promise<Array<Treat>> {
  return post("/api/treat", input);
}
