import config from "config";
import FormData from "form-data";
import Mailgun from "mailgun.js";

import { mailgun_options_schema } from "@/common/config_schema";

const mailgun = new Mailgun(FormData);

const mailgun_config = mailgun_options_schema.parse(config.get("mailgun"));
const client = mailgun.client(mailgun_config);
export default client;