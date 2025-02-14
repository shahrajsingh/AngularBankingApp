import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactions: Transaction[] = [];
  private transactionsSubject: BehaviorSubject<Transaction[]> = new BehaviorSubject<Transaction[]>([]);
  private nextTransactionId: number = 1;

  constructor(private accountService: AccountService) { }

  addTransaction(transaction: Transaction): void {
    transaction.id = this.nextTransactionId++;
    this.transactions.push(transaction);
    this.transactionsSubject.next([...this.transactions]);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.transactionsSubject.asObservable();
  }

  getTransactionsByAccount(accountId: number): Transaction[] {
    return this.transactions.filter(t => t.accountId === accountId);
  }

  transferFunds(fromAccountId: number, toAccountId: number, amount: number): boolean {
    const fromAccount = this.accountService.getAccountById(fromAccountId);
    const toAccount = this.accountService.getAccountById(toAccountId);

    if (!fromAccount || !toAccount) {
      console.error('One or both accounts not found.');
      return false;
    }

    if (amount <= 0 || amount > fromAccount.balance) {
      console.error('Invalid transfer amount.');
      return false;
    }

    const updatedFromBalance = fromAccount.balance - amount;
    const updatedToBalance = toAccount.balance + amount;
    this.accountService.updateAccountBalance(fromAccountId, updatedFromBalance);
    this.accountService.updateAccountBalance(toAccountId, updatedToBalance);

    const debitTransaction: Transaction = {
      id: this.nextTransactionId++,
      accountId: fromAccountId,
      type: 'debit',
      amount: amount,
      date: new Date(),
      description: `Transferred to account ID ${toAccountId}`
    };

    const creditTransaction: Transaction = {
      id: this.nextTransactionId++,
      accountId: toAccountId,
      type: 'credit',
      amount: amount,
      date: new Date(),
      description: `Received from account ID ${fromAccountId}`
    };

    this.transactions.push(debitTransaction, creditTransaction);
    this.transactionsSubject.next([...this.transactions]);
    return true;
  }

}