export type StoreType = 'thrift' | 'vintage' | 'flea_market' | 'estate_sale' | 'wholesale' | 'consignment' | 'antique' | 'other';

export interface StoreEntry {
  id: string;
  name: string;
  type: StoreType;
  location: string;
  state: string;
  dateVisited: string;
  rating: number;
  knownFor: string;
  bestSections: string;
  priceRange: 'budget' | 'moderate' | 'premium' | 'mixed';
  worthReturning: boolean;
  contentMade: string;
  notes: string;
  createdAt: string;
}
