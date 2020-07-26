<?php

namespace App\Http\Controllers;

use Validator;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    // public function __construct()
    // {
    //     $this->middleware('auth:api', ['except' => ['login']]);
    // }

    public function singup(Request $req)
    {
        // return response()->json($req->id_rank, 200);
        $validator = Validator::make($req->all(), [
            'name' => 'required|between:2,100',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create(array_merge($validator->validated(),['password' => bcrypt($req->password), 'id_department' => $req->id_department, 'id_rank' => $req->id_rank]));
        if (!$token = auth()->attempt(request(['name', 'password']))) {
            return response()->json(['message' => 'Не правильный логин или пароль'], 401);
        }
        return $this->respondWithToken($token);
        // return response()->json(['message' => 'Successfully registered','user' => $user], 201);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['name', 'password']);

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['message' => 'Не правильный логин или пароль'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Спасибо за работу!'], 200);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    // public function me()
    // {
    //     return response()->json(auth()->user());
    // }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json(['token' => $token, 'user' => auth()->user()->getJWTCustomClaims()], 200);
    }
}