import { createBareServer } from "@titaniumnetwork-dev/ultraviolet";

const bare = createBareServer("/bare/");

export default async function handler(req, res) {
  if (bare.shouldRoute(req)) {
    return bare.routeRequest(req, res);
  }

  res.status(404).send("Not found");
}
