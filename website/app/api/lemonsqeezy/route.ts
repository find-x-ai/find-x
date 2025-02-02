export const POST = async (req: Request) => {
    const body = await req.json();
    return new Response(JSON.stringify(body), { status: 200 });
};