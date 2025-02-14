export interface Transaction {            
    accountId: number;     
    amount: number;        
    date: Date;      
    description?: string;
    id: number;
    type: 'credit' | 'debit';
  }