export async function StreamedContent() {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return (
    <p className="text-foreground/75 max-w-prose">
      This content was streamed from an asynchronous Server Component. Replace this delay with
      parallel data fetching in your application.
    </p>
  );
}
