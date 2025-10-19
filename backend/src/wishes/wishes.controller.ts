import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import getUserFromReq from '../common/helpers/current-user.helper';
import { JwtGuard } from '../common/guards/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    const user = getUserFromReq(req);
    return this.wishesService.create(user, createWishDto);
  }

  @Get('last')
  findLatest() {
    return this.wishesService.findLatest();
  }

  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishesService.findById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':wishId')
  update(
    @Param('wishId') wishId: number,
    @Req() req,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const userId = getUserFromReq(req)?.id;
    return this.wishesService.update(wishId, userId, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':wishId')
  remove(@Param('wishId') wishId: number, @Req() req) {
    const userId = getUserFromReq(req)?.id;
    return this.wishesService.remove(wishId, userId);
  }

  @UseGuards(JwtGuard)
  @Post(':wishId/copy')
  copy(@Param('wishId') wishId: number, @Req() req) {
    const user = getUserFromReq(req);
    return this.wishesService.copyWish(wishId, user);
  }
}
