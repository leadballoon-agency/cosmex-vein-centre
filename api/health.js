// Health check endpoint
export default async function handler(req, res) {
    res.status(200).json({
        status: 'healthy',
        apis: {
            claude: !!process.env.CLAUDE_API_KEY,
            openai: !!process.env.OPENAI_API_KEY,
            versions: {
                claude: 'Claude 3.5 Sonnet',
                openai: 'GPT-4o'
            }
        },
        server: 'Cosmex Vein AI v2.0',
        timestamp: new Date().toISOString()
    });
}