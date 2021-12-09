# twitter-intersection

get intersection of Users A is following and users B is following.

## initialzation

```
npm init
```

You should write as follows on `./src/api-token.js`

```
exports.authorization = {
  consumer_key: CONSUMER_KEY,
  consumer_secret: CONSUMER_SECRET,
  access_token_key: ACCESS_TOKEN_KEY,
  access_token_secret: ACCESS_TOKEN_SECRET,
};
```

## usage

### get users

- This get JSON files described the following of a user in
- It outputs files splited by 200 users as `./output/${screen-name}-${index}.json)`
- Caution: It use Twitter API of `friends/list`, and the endpoint is restricted to 15 calls in 15 minutes.

```
node intersection.js -f
```

### intersect

- This loads JSON files and output intersection

```
node intersection.js -i
```
