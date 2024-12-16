import { PartialType } from '@nestjs/swagger';
import { ReviewDto } from './review.dto';

export class UpdateReviewDto extends PartialType(ReviewDto) {}
