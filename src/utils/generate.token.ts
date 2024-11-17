import jwt from 'jsonwebtoken';
const generateToken = (id: string, email: string) => {
  const token = jwt.sign({ Id: id, email }, process.env.JWT_SECRET!, {
    expiresIn: '15d',
  });
  return token;
};

export default generateToken;
