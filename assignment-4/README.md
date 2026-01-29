# Assignment 4: Building a Login and Signup System with Node.js, Express, and MongoDB

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/license/mit/)

## Notice about password hashing

[OWASP highly recommends](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) to use **Argon2id** algorithm.

But **bcrypt** is available via `USE_BCRYPT=1` environment variable.

## Testing

### Register

Success

![postman](/assignment-4/assets/register_success.png)

Invalid email

![postman](/assignment-4/assets/register_invalid_email.png)

Duplicate email

![postman](/assignment-4/assets/register_duplicate.png)

### Login

Success

![postman](/assignment-4/assets/login_success.png)

Invalid credentials

![postman](/assignment-4/assets/login_invalid.png)

### Profile

Success

![postman](/assignment-4/assets/profile_success.png)

Invalid credentials

![postman](/assignment-4/assets/profile_invalid.png)

### Logout

Success

![postman](/assignment-4/assets/profile_success.png)