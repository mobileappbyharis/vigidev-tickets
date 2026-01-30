/**
 * Health check endpoint for Cloud Run
 */
export async function GET() {
  return Response.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    },
    { status: 200 }
  );
}
