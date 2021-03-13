BLOG API

**Users** are registered accounts on the blog. Use the /users endpoint to register a new account, view other people's accounts, and view and edit your own.

Available methods
Method | Endpoint | Description
------ | ---------------------- | ----------------------
GET | /users | Get all users
POST | /users | Register a new user
GET | /users/:userid | Get information about a specific user
PUT | /users/:userid | Update information about a specific user
DELETE | /users/:userid | Remove a user
GET | /users/:userid/posts | Get a specific user's posts
