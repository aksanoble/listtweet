ListTweet

Uses Boa for working with Python modules.

./node_modules/.bin/bip install <package-name>

Depends on networkx, jsonpickle, python_louvain

install caddy to host server

reverse proxy
listtweet.com {
reverse_proxy :3000
}

to /etc/caddy/Caddyfile

sudo systemctl status / start / caddy

##

Create Neo4j indexes
https://neo4j.com/docs/cypher-manual/current/administration/indexes-for-search-performance/#administration-indexes-create-a-single-property-index

Create index on the id property as all lookups are based on Twitter ID. This was creating a huge bottleneck earlier.
