# twitter-intersection

get intersection of Users A is following and users B is following.

## initialzation

```
npm init
npm install
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

### get the following

- get JSON files described the following of a user in
- output files splited by 200 users as `./output/${screen-name}-${index}.json)`
- Caution: `friends/list`, the endpoint of Twitter API, is restricted to 15 calls in 15 minutes.

```
node intersection.js -f -u screen_name
```

### intersect

- load JSON files and output the intersection

```
node intersection.js -i -u screen_name0, screen_name1
```

### check the remaining trial

- output [rate_limit_status](https://syncer.jp/Web/API/Twitter/REST_API/GET/application/rate_limit_status/) as `rate_limit_status.json`

```
node intersection.js -r
```
