import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { compare, genSalt, hash } from 'bcryptjs';
import { Op, UniqueConstraintError } from 'sequelize';
import { FindAllDto } from './dto/find-all.dto';
import { transformAttr } from 'src/utils/transformAttr';
import { AuthDto } from './dto/auth.dto';

const publicUserAttr = [
  'id',
  'name',
  'phone',
  'email',
  'phone',
  'birthDate',
  'weight',
  'height',
  'createdAt',
  'updatedAt',
];

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async create({ password, ...createUserData }: CreateUserDto) {
    const salt = await genSalt(8);

    const hashPass = await hash(password, salt);

    try {
      const newUser = await this.userModel.create({
        password: hashPass,
        salt,
        ...createUserData,
      });

      return newUser;
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        if (e.fields.email) {
          throw new HttpException(
            'Email already in use',
            HttpStatus.BAD_REQUEST,
          );
        }
        if (e.fields.phone) {
          throw new HttpException(
            'Phone already in use',
            HttpStatus.BAD_REQUEST,
          );
        }

        throw new HttpException('Already in use', HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(
        'Something is wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll({ page = 1, pageSize = 10, sort, ...filter }: FindAllDto) {
    const offset = (page - 1) * pageSize;
    const { email, phone, name } = filter;

    const where = transformAttr(filter);
    console.log(where);

    return this.userModel.findAll({
      attributes: publicUserAttr,
      limit: pageSize,
      offset,
      where: {
        ...where,
        ...(name && {
          name: {
            [Op.like]: `%${name}%`,
          },
        }),
        ...(email && {
          email: {
            [Op.like]: `%${email}%`,
          },
        }),
        ...(phone && {
          phone: {
            [Op.like]: `%${phone}%`,
          },
        }),
      },
      order: [[sort?.field || 'id', sort?.direction || 'ASC']],
    });
  }

  async findOne(id: number) {
    return this.userModel.findByPk(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userModel.findByPk(id);

      let { password, ...updateUserData } = updateUserDto;

      if (password) {
        const salt = await genSalt(8);

        const hashPass = await hash(password, salt);

        await user.update({ ...updateUserData, password: hashPass, salt });
      } else {
        await user.update(updateUserData);
      }

      const updatedUser = await this.userModel.findByPk(id, {
        attributes: publicUserAttr,
      });

      return updatedUser;
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        if (e.fields.email) {
          throw new HttpException(
            'Email already in use',
            HttpStatus.BAD_REQUEST,
          );
        }
        if (e.fields.phone) {
          throw new HttpException(
            'Phone already in use',
            HttpStatus.BAD_REQUEST,
          );
        }

        throw new HttpException('Already in use', HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(
        'Something is wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    return this.userModel.destroy({ where: { id } });
  }

  async auth(authDto: AuthDto) {
    const { email, phone, password } = authDto;

    const user = await this.userModel.findOne({
      where: {
        ...(email && {
          email,
        }),
        ...(phone && {
          phone,
        }),
      },
    });

    const isPaaswordsMatched = await compare(password, user.password);

    if (isPaaswordsMatched) {
      const userData = user.toJSON();
      const jwt = await hash(JSON.stringify(userData), 10);

      const { password, salt, ...restUserData } = userData;

      return { user: restUserData, jwt };
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
