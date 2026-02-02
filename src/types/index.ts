import { Database } from './database';

export type Coffee = Database['public']['Tables']['coffee']['Row'];

export type Review = Database['public']['Tables']['review']['Row'];

export interface CoffeeWithReview extends Coffee {
    review: Review[] | null;
}