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
