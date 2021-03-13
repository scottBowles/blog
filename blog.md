TODO
provide a /posts/:postid/publish route
provide a publish instance method on the post schema
postDelete doesn't look to account for !req.user -- check this and other routes

ROUTES

/
/log-in
/sign-up
/log-out
/users
/users/:userid
/users/:userid/posts
/users/:userid/posts/:postid
/posts
/posts/:postid
/posts/:postid/comments
/posts/:postid/comments/:commentid

MODELS

Users
firstName
lastName
email
password
v - fullName

Posts
title
text
timestamp - created & updated?
isPublished
user

Comments
text
timestamp - created & updated?
author
email
post
