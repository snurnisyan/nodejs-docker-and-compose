import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { createHashPass } from '../common/helpers/hash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const hashedPass = await createHashPass(createUserDto.password);
    let newUser: User;
    try {
      newUser = await this.userRepository.save({
        ...createUserDto,
        password: hashedPass,
      });
    } catch (err) {
      if (err instanceof QueryFailedError) {
        const newErr = err.driverError;
        if (newErr.code === '23505') {
          throw new ConflictException(
            'Пользователь с таким email или username уже зарегистрирован',
          );
        }
      }
    }
    return this.findById(newUser.id, true);
  }

  async findByUsername(username: string, withPassword = false) {
    let query = this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.username) LIKE LOWER(:username)', { username })
      .addSelect('user.email');
    if (withPassword) {
      query = query.addSelect('user.password');
    }

    const user = await query.getOne();
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async findById(id: number, withEmail = false) {
    let query = this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id });
    if (withEmail) {
      query = query.addSelect('user.email');
    }
    const user = await query.getOne();

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async findMany(query: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where(
        'LOWER(user.username) LIKE LOWER(:query) OR (user.email) LIKE LOWER(:query)',
        { query: `%${query}%` },
      )
      .addSelect('user.email')
      .getMany();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await createHashPass(updateUserDto.password);
    }

    try {
      await this.userRepository.update(id, updateUserDto);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        const newErr = err.driverError;
        if (newErr.code === '23505') {
          throw new ConflictException(
            'Пользователь с таким email или username уже зарегистрирован',
          );
        }
      }
    }
    return this.findById(id, true);
  }

  async getUserWishes(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['wishes', 'wishes.owner', 'wishes.offers'],
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user.wishes;
  }

  async getWishesByUsername(username: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.wishes', 'wishes')
      .leftJoinAndSelect('wishes.offers', 'offers')
      .where('LOWER(user.username) LIKE LOWER(:username)', { username })
      .addSelect('user.email')
      .getOne();

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user.wishes;
  }
}
