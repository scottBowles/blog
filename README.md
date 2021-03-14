# BLOG REST API

## Table of Contents

1. [Resources](#resources)
1. [Endpoints](#endpoints)
1. [Endpoint Details](#endpointdetails)

<h2 id="resources">Resources</h2>

<h3 id="users">Users</h3>

| Attribute | Constraints                                     | Description                                                       | Type    |
| --------- | ----------------------------------------------- | ----------------------------------------------------------------- | ------- |
| firstName | required; minimum 1 char; maximum 255 char      | User first name                                                   | string  |
| lastName  | required; minimum 1 char; maximum 255 char      | User last name                                                    | string  |
| email     | required; unique; valid email; maximum 255 char | User email address                                                | string  |
| password  | required; minimum 8 char; maximum 255 char      | User password                                                     | string  |
| isAdmin   | optional                                        | Defaults to false. Determines whether user has admin permissions. | boolean |

<h3 id="posts">Posts</h3>

| Attribute   | Constraints                                | Description                                                                                                                                                                  | Type    |
| ----------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| title       | optional; minimum 1 char; maximum 255 char | Title for post                                                                                                                                                               | string  |
| text        | optional; minimum 1 char; maximum 255 char | Body of the post                                                                                                                                                             | string  |
| isPublished | optional; valid email; maximum 255 char    | Defaults to false. When isPublished is false, the post will only be return in requests made by the post's user and admin users. See below for details on specific endpoints. | boolean |
| user        | required; unique; 16 char objectID         | User password                                                                                                                                                                | string  |

<h3 id="comments">Comments</h3>

| Attribute | Constraints                                | Description                       | Type   |
| --------- | ------------------------------------------ | --------------------------------- | ------ |
| text      | required; minimum 1 char; maximum 255 char | Comment text                      | string |
| author    | required; minimum 1 char; maximum 255 char | Comment author's name or handle   | string |
| email     | optional; valid email; maximum 255 char    | Comment author's email address    | string |
| post      | required; unique; 16 char objectID         | Post to which the comment belongs | string |

<h2 id="endpoints">Endpoints</h2>

### User Endpoints

Available Methods

| Method | Endpoint                                            | Description                              |
| ------ | --------------------------------------------------- | ---------------------------------------- |
| GET    | [/users](#get-/users)                               | Get all users                            |
| POST   | [/users](#post-/users)                              | Register a new user                      |
| GET    | [/users/{userid}](#get-/users/{userid})             | Get information about a specific user    |
| PUT    | [/users/{userid}](#put-/users/{userid})             | Update information about a specific user |
| DELETE | [/users/{userid}](#delete-/users/{userid})          | Remove a user                            |
| GET    | [/users/{userid}/posts](#get-/users/{userid}/posts) | Get a specific user's posts              |

### Post Endpoints

Available Methods

| Method | Endpoint                                                                             | Description                         |
| ------ | ------------------------------------------------------------------------------------ | ----------------------------------- |
| GET    | [/posts](#get-/posts)                                                                | Get all posts                       |
| POST   | [/posts](#post-/posts)                                                               | Create a new post                   |
| GET    | [/posts/{postid}](#get-/posts/{postid})                                              | Get a specific post                 |
| PUT    | [/posts/{postid}](#put-/posts/{postid})                                              | Edit a specific post                |
| DELETE | [/posts/{postid}](#delete-/posts/{postid})                                           | Remove a specific post              |
| POST   | [/posts/{postid}/publish](#post-/posts/{postid}/publish)                             | Publish an unpublished post         |
| POST   | [/posts/{postid}/unpublish](#post-/posts/{postid}/unpublish)                         | Unpublish a published post          |
| GET    | [/posts/{postid}/comments](#get-/posts/{postid}/comments)                            | Get the comments on a specific post |
| POST   | [/posts/{postid}/comments](#post-/posts/{postid}/comments)                           | Add a comment on a specific post    |
| GET    | [/posts/{postid}/comments/{commentid}](#get-/posts/{postid}/comments/{commentid})    | Get a specific comment              |
| PUT    | [/posts/{postid}/comments/{commentid}](#put-/posts/{postid}/comments/{commentid})    | Update a specific comment           |
| DELETE | [/posts/{postid}/comments/{commentid}](#delete-/posts/{postid}/comments/{commentid}) | Remove a specific comment           |

### Other Endpoints Offered

Available Methods

| Method | Endpoint               | Description                          |
| ------ | ---------------------- | ------------------------------------ |
| GET    | [/me](#get-/me)        | Get the logged in user's information |
| POST   | [/login](#post-/login) | Log in a user                        |

<h2 id="endpointdetails">Endpoint Details</h2>

<h3 id="get-/users">GET /users</h3>

Get all users

#### _Parameters_

| Query String Parameter | Description                                                            | Type   |
| ---------------------- | ---------------------------------------------------------------------- | ------ |
| limit                  | Response will return at most the limit number of users                 | number |
| skip                   | Query will skip the provided number of users (ordered by registration) | number |

#### _Returns_

An array of [users](#users)

#### _Example Request_

curl --location --request GET 'http://localhost:3000/users'

#### _Example Response_

```json
[
  {
    "_id": "604d8dc8a9c87361f984d130",
    "firstName": "Malcolm",
    "lastName": "Reynolds",
    "email": "captaintightpants@gmail.com",
    "__v": 0,
    "fullName": "Malcolm Reynolds",
    "id": "604d8dc8a9c87361f984d130"
  },
  {
    "_id": "604d8e23a9c87361f984d131",
    "firstName": "Inara",
    "lastName": "Serra",
    "email": "iserra@gmail.com",
    "__v": 0,
    "fullName": "Inara Serra",
    "id": "604d8e23a9c87361f984d131"
  },
  {
    "_id": "604d8e60a9c87361f984d132",
    "firstName": "Zoe",
    "lastName": "Washburn",
    "email": "zoe@gmail.com",
    "__v": 0,
    "fullName": "Zoe Washburne",
    "id": "604d8e60a9c87361f984d132"
  }
]
```

<h3 id="post-/users">POST /users</h3>

Register a new user

#### _Parameters_

| Request Body | Required / Optional | Description                                            | Type   |
| ------------ | ------------------- | ------------------------------------------------------ | ------ |
| firstName    | Required            | User first name. Must be between 1 and 255 characters. | string |
| lastName     | Required            | User last name. Must be between 1 and 255 characters.  | string |
| email        | Required            | User email. Must be unique and at most 255 characters. | string |
| password     | Required            | User password. Must be between 8 and 255 characters.   | string |

#### _Returns_

The newly registered [user](#users) with password omitted

#### _Example Request_

curl --location --request POST 'http://localhost:3000/users/' \
--header 'Content-Type: application/json' \
--data-raw '{
"firstName": "Hoban",
"lastName": "Washburne",
"email": "wash@gmail.com",
"password": "washPassword"
}'

#### _Example Response_

```json
{
  "_id": "604d902aa9c87361f984d134",
  "firstName": "Hoban",
  "lastName": "Washburne",
  "email": "wash@gmail.com",
  "fullName": "Hoban Washburne"
}
```

<h3 id="get-/users/{userid}">GET /users/{userid}</h3>

Get information about a specific user

#### _Parameters_

| Path Parameter | Description                                                                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| userid         | The user's unique id. This will be a 16-character-long string. To get the information for the logged in user, `/me` may also be used for convenience |

#### _Returns_

The requested [user](#users)

#### _Example Request_

curl --location --request GET 'http://localhost:3000/users/604d8dc8a9c87361f984d130'

#### _Example Response_

```json
{
  "_id": "604d8dc8a9c87361f984d130",
  "firstName": "Malcolm",
  "lastName": "Reynolds",
  "email": "captaintightpants@gmail.com",
  "isAdmin": true,
  "__v": 0,
  "fullName": "Malcolm Reynolds",
  "id": "604d8dc8a9c87361f984d130"
}
```

<h3 id="put-/users/{userid}">PUT /users/{userid}</h3>

Update information about a specific user. Logged-in users who are not admins may update their own information only.

#### _Parameters_

| Path Parameter | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| userid         | The user's unique id. This will be a 16-character-long string. |

| Request Body | Required / Optional | Description                                            | Type   |
| ------------ | ------------------- | ------------------------------------------------------ | ------ |
| firstName    | Required            | User first name. Must be between 1 and 255 characters. | string |
| lastName     | Required            | User last name. Must be between 1 and 255 characters.  | string |
| email        | Required            | User email. Must be unique and at most 255 characters. | string |
| password     | Required            | User password. Must be between 8 and 255 characters.   | string |

| Header Parameter | Required / Optional | Description                                                                                |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| x-auth-token     | Required            | A valid JSON Web Token, which may be acquired at registration, or with the /login endpoint |

<h3 id="delete-/users/{userid}">DELETE /users/{userid}</h3>

Remove a user. Logged-in users who are not admins may remove their own information only.

#### _Parameters_

| Path Parameter | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| userid         | The user's unique id. This will be a 16-character-long string. |

| Header Parameter | Required / Optional | Description                                                                                |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| x-auth-token     | Required            | A valid JSON Web Token, which may be acquired at registration, or with the /login endpoint |

<h3 id="get-/users/{userid}/posts">GET /users/{userid}/posts</h3>

Get a specific user's posts. Non-admins will receive only published posts, unless logged in and querying their own `userid`, in which case unpublished posts will be included as well. Admins will receive both published and unpublished posts regardless.

#### _Parameters_

| Path Parameter | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| userid         | The user's unique id. This will be a 16-character-long string. |

| Query String Parameter | Description                                                                | Type   |
| ---------------------- | -------------------------------------------------------------------------- | ------ |
| limit                  | Response will return at most the limit number of posts                     | number |
| skip                   | Query will skip the provided number of posts (ordered by date of creation) | number |

| Header Parameter | Required / Optional | Description                                                                                |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| x-auth-token     | Optional            | A valid JSON Web Token, which may be acquired at registration, or with the /login endpoint |

<h3 id="get-/posts">GET /posts</h3>

Get all posts. By default this will only return published posts.

#### _Parameters_

| Query String Parameter | Description                                                                | Type    |
| ---------------------- | -------------------------------------------------------------------------- | ------- |
| limit                  | Response will return at most the limit number of posts                     | number  |
| skip                   | Query will skip the provided number of posts (ordered by date of creation) | number  |
| includeunpublished     | Includes unpublished posts if and only if logged-in user is an admin       | boolean |

| Header Parameter | Required / Optional | Description                                                                                |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| x-auth-token     | Optional            | A valid JSON Web Token, which may be acquired at registration, or with the /login endpoint |

<h3 id="post-/posts">POST /posts</h3>

Create a new post. Requires a logged-in user, which will in turn be saved as the post's user.

#### _Parameters_

| Request Body | Required / Optional | Description                                                                         | Type    |
| ------------ | ------------------- | ----------------------------------------------------------------------------------- | ------- |
| title        | Optional            | Post title. Must be between 1 and 255 characters long.                              | string  |
| text         | Optional            | Post text. Must be between 1 and 99999 characters long.                             | string  |
| isPublished  | Optional            | When false, post will only be visible to admins and the post's own user.            | boolean |
| (user)       | (n/a)               | (user set to the logged-in user and needs not be otherwise included in the request) | (n/a)   |

| Header Parameter | Required / Optional | Description                                                                                |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| x-auth-token     | Required            | A valid JSON Web Token, which may be acquired at registration, or with the /login endpoint |

<h3 id="get-/posts/{postid}">GET /posts/{postid}</h3>

Gets a single post. If the post is unpublished, it will only be accessible to admins and the post's user.

#### _Parameters_

| Path Parameter | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| postid         | The post's unique id. This will be a 16-character-long string. |

| Header Parameter | Required / Optional | Description                                                                                |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| x-auth-token     | Optional            | A valid JSON Web Token, which may be acquired at registration, or with the /login endpoint |

<h3 id="put-/posts/{postid}">PUT /posts/{postid}</h3>

Updates a single post. Only accessible to admins and the post's user.

#### _Parameters_

| Path Parameter | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| postid         | The post's unique id. This will be a 16-character-long string. |

| Request Body | Required / Optional | Description                                                                                                                                                                                                                                                               | Type    |
| ------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| title        | Optional            | Post title. Must be between 1 and 255 characters long.                                                                                                                                                                                                                    | string  |
| text         | Optional            | Post text. Must be between 1 and 99999 characters long.                                                                                                                                                                                                                   | string  |
| isPublished  | Optional            | When false, post will only be visible to admins and the post's own user. To change only this property, [`/posts/{postid}/publish`](#post-/posts/{postid}/publish) and [`/posts/{postid}/unpublish`](#post-/posts/{postid}/unpublish) routes are included for convenience. | boolean |
| (user)       | (n/a)               | (Post user cannot be changed. If it is included in the body it will be ignored.)                                                                                                                                                                                          | (n/a)   |

| Header Parameter | Required / Optional | Description                                                                                |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| x-auth-token     | Required            | A valid JSON Web Token, which may be acquired at registration, or with the /login endpoint |

<h3 id="delete-/posts/{postid}">DELETE /posts/{postid}</h3>

Remove a user. Logged-in users may remove their own account only. Admins may remove any account.

#### _Parameters_

| Path Parameter | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| postid         | The post's unique id. This will be a 16-character-long string. |

| Header Parameter | Required / Optional | Description                                                                                |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| x-auth-token     | Required            | A valid JSON Web Token, which may be acquired at registration, or with the /login endpoint |

<h3 id="post-/posts/{postid}/publish">POST /posts/{postid}/publish</h3>

Sets the isPublished attribute for the given post to `true`. Posts may be published by their own user or admins.

#### _Parameters_

| Path Parameter | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| postid         | The post's unique id. This will be a 16-character-long string. |

| Header Parameter | Required / Optional | Description                                                                                |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| x-auth-token     | Required            | A valid JSON Web Token, which may be acquired at registration, or with the /login endpoint |

<h3 id="post-/posts/{postid}/unpublish">POST /posts/{postid}/unpublish</h3>

Sets the isPublished attribute for the given post to `false`. Posts may be unpublished by their own user or admins.

#### _Parameters_

| Path Parameter | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| postid         | The post's unique id. This will be a 16-character-long string. |

| Header Parameter | Required / Optional | Description                                                                                |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| x-auth-token     | Required            | A valid JSON Web Token, which may be acquired at registration, or with the /login endpoint |

<h3 id="get-/posts/{postid}/comments">GET /posts/{postid}/comments</h3>

Get the comments for the given post. Comments may only be retrieved for published posts.

#### _Parameters_

| Path Parameter | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| postid         | The post's unique id. This will be a 16-character-long string. |

| Query String Parameter | Description                                                                   | Type   |
| ---------------------- | ----------------------------------------------------------------------------- | ------ |
| limit                  | Response will return at most the limit number of comments                     | number |
| skip                   | Query will skip the provided number of comments (ordered by date of creation) | number |

<h3 id="post-/posts/{postid}/comments">POST /posts/{postid}/comments</h3>

Create a new comment for the given post. Comments may only be created for published posts.

#### _Parameters_

| Path Parameter | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| postid         | The post's unique id. This will be a 16-character-long string. |

| Request Body | Required / Optional | Description                                                           | Type    |
| ------------ | ------------------- | --------------------------------------------------------------------- | ------- |
| text         | Required            | Comment text.                                                         | string  |
| author       | Required            | Comment author - a name or handle for display.                        | string  |
| email        | Optional            | An email address for the comment's author.                            | boolean |
| (post)       | (n/a)               | (post will be set to the post retrieved by the postid path parameter) | n/a     |

<h3 id="get-/posts/{postid}/comments/{commentid}">GET /posts/{postid}/comments/{commentid}</h3>

Get a single comment.

#### _Parameters_

| Path Parameter | Description                                                       |
| -------------- | ----------------------------------------------------------------- |
| postid         | The post's unique id. This will be a 16-character-long string.    |
| commentid      | The comment's unique id. This will be a 16-character-long string. |

<h3 id="put-/posts/{postid}/comments/{commentid}">PUT /posts/{postid}/comments/{commentid}</h3>

Update a single comment. Only accessible for admins.

#### _Parameters_

| Path Parameter | Description                                                       |
| -------------- | ----------------------------------------------------------------- |
| postid         | The post's unique id. This will be a 16-character-long string.    |
| commentid      | The comment's unique id. This will be a 16-character-long string. |

| Request Body | Required / Optional | Description                                                             | Type    |
| ------------ | ------------------- | ----------------------------------------------------------------------- | ------- |
| text         | Required            | Comment text.                                                           | string  |
| author       | Required            | Comment author - a name or handle for display.                          | string  |
| email        | Optional            | An email address for the comment's author.                              | boolean |
| (post)       | (n/a)               | (post will be set to the comment's original post and cannot be changed) | n/a     |

| Header Parameter | Required / Optional | Description                                                                                |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| x-auth-token     | Required            | A valid JSON Web Token, which may be acquired at registration, or with the /login endpoint |

<h3 id="delete-/posts/{postid}/comments/{commentid}">DELETE /posts/{postid}/comments/{commentid}</h3>

Removes a comment. Logged in users may remove comments on their own posts. Admins may remove any comment.

#### _Parameters_

| Path Parameter | Description                                                       |
| -------------- | ----------------------------------------------------------------- |
| postid         | The post's unique id. This will be a 16-character-long string.    |
| commentid      | The comment's unique id. This will be a 16-character-long string. |

| Header Parameter | Required / Optional | Description                                                                                |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| x-auth-token     | Required            | A valid JSON Web Token, which may be acquired at registration, or with the /login endpoint |

<h3 id="get-/me">GET /me</h3>

Get the logged in user's information.

#### _Parameters_

| Header Parameter | Required / Optional | Description                                                                                |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| x-auth-token     | Required            | A valid JSON Web Token, which may be acquired at registration, or with the /login endpoint |

<h3 id="post-/login">POST /login</h3>

Log in a user. Returns a JSON Web Token to be included in the x-auth-token header of requests.

#### _Parameters_

| Request Body | Required / Optional | Description                                                      | Type   |
| ------------ | ------------------- | ---------------------------------------------------------------- | ------ |
| email        | Required            | User's email address, provided at registration or updated since. | string |
| password     | Required            | User's password, provided at registration or updated since.      | string |
