import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewDto } from './dto/review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { ParamProdutoId } from 'src/decorators/param-produtoId.decorator';
import { Paramid } from 'src/decorators/param-id.decorator';

@UseGuards(AuthGuard)
@Controller('review')
@ApiTags("Controle de Review de compras")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
 async create(@Body() data: ReviewDto, @User() userId: number) {
    return this.reviewService.addReview(data, userId);
  }


  @Get()
  async getReviewPerUserId(@User() userId: number) {
    return this.reviewService.getUserReviews(userId);
  }


  @Get(":produtoId")
  async getReviewPerProduct(@ParamProdutoId() produtoId: number) {
    return this.reviewService.getReviewsByProduct(produtoId)
  }

  @Put(":id")
  async putReview(@User() userId: number, @Paramid() id: number, @Body() data: UpdateReviewDto) {
    return this.reviewService.updateReview(userId, data, id)
  }
  
  
  
}
