export interface Pokemon {
  id: string;
  name: string;
  type: string;
  weight: number;
  abilities: [{
    name: string;
    type: string;
    description: string;
    damage: number;
  }];
}