import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import onError from "../../../../src/server/middlewares/errors";
import { registerUser } from "../../../server/controllers/authControllers";
import dbConnect from "../../../server/lib/dbConnect";

const handler = nc<NextApiRequest, NextApiResponse>({ onError });

dbConnect();

/**
 * @swagger
 * /api/auth/users:
 *   post:
 *     description: register user
 *     responses:
 *       201:
 *         description: success
 *     tags:
 *       - Auth
 */
handler.post(registerUser);

export default handler;
