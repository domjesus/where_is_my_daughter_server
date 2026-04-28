<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AllowedEmailMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $allowedEmail = 'domjesus@gmail.com';
        $email = strtolower(trim((string) $request->input('email')));

        if ($email !== $allowedEmail) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Unauthorized email address.',
                ], 403);
            }

            return back()
                ->withErrors(['email' => 'You cannnot access this application with the provided email address.'])
                ->withInput($request->except(['password', 'password_confirmation']));
        }

        return $next($request);
    }
}
