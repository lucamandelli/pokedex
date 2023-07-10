export interface Pokemon {
  id: string;
  userId: string;
  name: string;
  photo: string;
  type: string;
  weight: number;
  abilities: [{
    name: string;
    type: string;
    description: string;
    damage: number;
  }];
}