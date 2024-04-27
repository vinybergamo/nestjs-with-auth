import { SetMetadata } from '@nestjs/common';

export const isPublic = 'public';
export const IsPublic = () => SetMetadata(isPublic, true);
