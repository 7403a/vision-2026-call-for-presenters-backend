// Define the structure of your environment variables, including the D1 database binding.
export interface Env {
	DB: D1Database;
    // For production, you should store your API key as a secret in Cloudflare
    // API_KEY: string;
}

// The secret API key
const API_KEY = "a5d1bdba-ee88-46f2-a62e-2d0edb159a21";

// Helper function to return a JSON response
const jsonResponse = (data: unknown, status = 200) => {
	return new Response(JSON.stringify(data, null, 2), {
		headers: {
			'content-type': 'application/json;charset=UTF-8',
		},
		status: status,
	});
};

// Helper function to return an error response
const errorResponse = (message: string, status = 400) => {
	return jsonResponse({ error: message }, status);
};

const corsHeaders = {
  'Access-Control-Allow-Headers': '*', // What headers are allowed. * is wildcard. Instead of using '*', you can specify a list of specific headers that are allowed, such as: Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept, Authorization.
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Origin': '*', // This is URLs that are allowed to access the server. * is the wildcard character meaning any URL can.
}
export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method === "OPTIONS") {
		    return new Response("OK", {
		      headers: corsHeaders
		    });
		}
        // --- API Key Authentication ---
        // In a real app, use `env.API_KEY` after setting it as a secret in your Worker's settings
        const providedKey = request.headers.get('X-API-Key');
        if (providedKey !== API_KEY) {
            return errorResponse('Unauthorized. Invalid or missing API Key.', 401);
        }
        // --- End of Authentication ---

		const { pathname } = new URL(request.url);
		const pathParts = pathname.split('/').filter(p => p); // e.g., ['api', 'presenters', '1']

		// We expect requests to be in the format /api/presenters/:id
		if (pathParts.length < 2 || pathParts[0] !== 'api' || pathParts[1] !== 'presenters') {
			return errorResponse('Not Found. Please use the /api/presenters endpoint.', 404);
		}

		const presenterId = pathParts[2] ? parseInt(pathParts[2], 10) : null;

		try {
			switch (request.method) {
				case 'GET':
					if (presenterId) {
						// Get a single presenter by ID
						const stmt = env.DB.prepare('SELECT * FROM presenters WHERE id = ?').bind(presenterId);
						const presenter = await stmt.first();
						return presenter
							? jsonResponse(presenter)
							: errorResponse(`Presenter with ID ${presenterId} not found.`, 404);
					} else {
						// Get all presenters
						const { results } = await env.DB.prepare('SELECT * FROM presenters ORDER BY name ASC').all();
						return jsonResponse(results);
					}

				case 'POST':
					// Add a new presenter
					const newPresenter = await request.json<{ name: string; topic: string; bio?: string }>();
					if (!newPresenter.name || !newPresenter.topic) {
						return errorResponse('Both "name" and "topic" are required fields.');
					}
					const { success, meta } = await env.DB.prepare(
						'INSERT INTO presenters (name, topic, bio) VALUES (?, ?, ?)'
					).bind(newPresenter.name, newPresenter.topic, newPresenter.bio || null).run();

					if (success) {
						return jsonResponse({ message: 'Presenter added successfully.', id: meta.last_row_id }, 201);
					} else {
						return errorResponse('Failed to add presenter.', 500);
					}


				case 'PUT':
					// Update an existing presenter
					if (!presenterId) return errorResponse('Presenter ID is required for updates.');

					const updatedPresenter = await request.json<{ name: string; topic: string; bio?: string }>();
					if (!updatedPresenter.name || !updatedPresenter.topic) {
						return errorResponse('Both "name" and "topic" are required fields.');
					}
					const { meta: updateMeta } = await env.DB.prepare(
						'UPDATE presenters SET name = ?, topic = ?, bio = ? WHERE id = ?'
					).bind(updatedPresenter.name, updatedPresenter.topic, updatedPresenter.bio || null, presenterId).run();

					return updateMeta.changes > 0
						? jsonResponse({ message: `Presenter ${presenterId} updated successfully.` })
						: errorResponse(`Presenter with ID ${presenterId} not found or no changes made.`, 404);

				case 'DELETE':
					// Delete a presenter
					if (!presenterId) return errorResponse('Presenter ID is required for deletion.');

					const { meta: deleteMeta } = await env.DB.prepare('DELETE FROM presenters WHERE id = ?').bind(presenterId).run();

					return deleteMeta.changes > 0
						? jsonResponse({ message: `Presenter ${presenterId} deleted successfully.` })
						: errorResponse(`Presenter with ID ${presenterId} not found.`, 404);

				default:
					return errorResponse(`Method ${request.method} not allowed.`, 405);
			}
		} catch (e: any) {
			return errorResponse(`An unexpected error occurred: ${e.message}`, 500);
		}
	},
} satisfies ExportedHandler<Env>;
