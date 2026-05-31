import { IsArray, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString() @MinLength(1) @MaxLength(5000) content!: string;
  @IsOptional() @IsArray() mediaUrls?: string[];
  @IsOptional() @IsString() communityId?: string;
}

export class UpdatePostDto {
  @IsString() @MinLength(1) @MaxLength(5000) content!: string;
}
