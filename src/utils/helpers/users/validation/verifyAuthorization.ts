import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';

export async function verifyAuthorization(req: NextApiRequest): Promise<{ statusCode: number, error: string | null, isTokenValid: boolean }> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  let isValidToken = false;

  if (token == null) {
    return {
      statusCode: 401,
      error: "Missing Authorization Header",
      isTokenValid: isValidToken
    };
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    isValidToken = true;
  } catch (err) {
    return {
      statusCode: 403,
      error: "Forbidden",
      isTokenValid: isValidToken
    };
  }

  return {
    statusCode: 200,
    error: null,
    isTokenValid: isValidToken
  };
}
