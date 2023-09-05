import config from "config";

import { OAuthClient } from "@/database/tables";
import { checkTextAgainstHash } from "@/auth/hashed_secrets";
import {z} from "zod";


const [stateOAuthClient] = await OAuthClient.findOrCreate({
  where: {
    id: "state-socket",
  },
  defaults: {
    id: "state-socket",
    grants: ["authorization_code"],
    allowed_scopes: [ "socket:state" ],
    redirect_uris: [],
  },
});

const clientSecret = z.string().parse(config.get("hackathonStateSocket.clientSecret"));

if (!checkTextAgainstHash(
  {
    hashed_secret: stateOAuthClient.hashed_secret,
    salt: stateOAuthClient.secret_salt,
  },
  clientSecret
)) {
  await stateOAuthClient.updateSecret(clientSecret);
}

export default stateOAuthClient;