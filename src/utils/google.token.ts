// import { OAuth2Client } from 'google-auth-library';

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// export const verifyGoogleToken = async (token: string) => {
//   try {
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });
//     const payload = ticket.getPayload();
//     return payload; // Contains email, email_verified, etc.
//   } catch (error) {
//     console.error('Google Token Verification Error:', error);
//     return null;
//   }
// };
