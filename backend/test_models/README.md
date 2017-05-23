Use the JSON files in this directory as the POST bodies of requests to the server.

Example:

```
curl -XPOST http://localhost:3000/compile/gen -d @alexnet.json -H 'Content-Type: application/json'
```

