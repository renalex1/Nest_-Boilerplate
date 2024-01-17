import { Request, Response } from 'express';
import { User } from 'src/user/entities/user.entity';

type Ctx = {
  req: Request & { user: Pick<User, 'email' | 'name'> };
  res: Response;
};

export default Ctx;
