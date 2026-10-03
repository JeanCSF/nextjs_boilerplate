import { exampleSchema } from '@/lib/example-schema';

const maxRequestBodyBytes = 8 * 1024;

function isAuthorizedForMutation(): boolean {
  return false;
}

export async function POST(request: Request) {
  const declaredBodyLength = Number(request.headers.get('content-length'));

  if (Number.isFinite(declaredBodyLength) && declaredBodyLength > maxRequestBodyBytes) {
    return Response.json({ error: 'Request body too large.' }, { status: 413 });
  }

  const reader = request.body?.getReader();

  if (!reader) {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const chunks: Uint8Array[] = [];
  let bodyLength = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    bodyLength += value.byteLength;

    if (bodyLength > maxRequestBodyBytes) {
      await reader.cancel();
      return Response.json({ error: 'Request body too large.' }, { status: 413 });
    }

    chunks.push(value);
  }

  const bodyBytes = new Uint8Array(bodyLength);
  let offset = 0;

  for (const chunk of chunks) {
    bodyBytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  let body: unknown;

  try {
    body = JSON.parse(new TextDecoder().decode(bodyBytes));
  } catch {
    body = null;
  }

  const result = exampleSchema.safeParse(body);

  if (!result.success) {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (!isAuthorizedForMutation()) {
    return Response.json({ error: 'Forbidden.' }, { status: 403 });
  }

  return Response.json({ value: result.data.value });
}
