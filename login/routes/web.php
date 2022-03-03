<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

Route::prefix(config('app.app_dir'))->group(function () {
    Route::get('/login', [AuthController::class, 'login']);
    Route::get('/auth-callback', [AuthController::class, 'authCallback']);
    Route::get('/refresh', [AuthController::class, 'refresh']);
});

// We may be redirecting the auth-callback route from the server root back here using Apache rewrite.
Route::prefix('')->group(function () {
    Route::get('/auth-callback', [AuthController::class, 'authCallback']);
});
