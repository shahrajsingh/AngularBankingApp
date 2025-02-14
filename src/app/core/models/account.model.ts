export interface Account {
    balance: number;
    createdDate: Date;
    id: number;
    name: string;
    type: 'Chequing' | 'Savings';         
  }