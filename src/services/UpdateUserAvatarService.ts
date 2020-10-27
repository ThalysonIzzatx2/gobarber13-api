import path from 'path';
import fs from 'fs';
import { getRepository } from 'typeorm';

import AppError from '../erros/AppError';

import uploadConfig from '../config/upload';
import User from '../models/User';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}


class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename}: IRequest): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      //deletar avatar anterior
      const userAvatarFilepath  =  path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilepath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilepath);
      }
    }

    user.avatar = avatarFilename;

    await usersRepository.save(user);

    return user;

  }
}

export default UpdateUserAvatarService;