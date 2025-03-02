export async function waitFor(seconds: number) {
    await new Promise(f => setTimeout(f, seconds * 1000));
}
