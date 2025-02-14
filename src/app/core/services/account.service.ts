import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  
  private accounts: Account[] = [];
  private accountsSubject: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);
  private nextAccountId: number = 1;

  constructor() { }

  createAccount(name: string, type: 'Chequing' | 'Savings', initialBalance: number): Account {
    const newAccount: Account = {
      id: this.nextAccountId++,
      name,
      type,
      balance: initialBalance,
      createdDate: new Date()
    };
    this.accounts.push(newAccount);
    this.accountsSubject.next([...this.accounts]);
    return newAccount;
  }

  getAccounts(): Observable<Account[]> {
    return this.accountsSubject.asObservable();
  }

  getAccountById(id: number): Account | undefined {
    return this.accounts.find(account => account.id === id);
  }

  updateAccountBalance(id: number, newBalance: number): boolean {
    const account = this.getAccountById(id);
    if (account) {
      account.balance = newBalance;
      this.accountsSubject.next([...this.accounts]);
      return true;
    }
    return false;
  }

}
