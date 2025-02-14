import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AccountService } from '../../../core/services/account.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { Account } from '../../../core/models/account.model';
import { Transaction } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-history',
  standalone: false,
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss'
})
export class TransactionHistoryComponent implements OnInit {
  accounts: Account[] = [];
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  historyForm: FormGroup = new FormGroup({});
  displayedColumns: string[] = ['id', 'date', 'type', 'amount', 'description'];

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.accountService.getAccounts().subscribe((accounts: Account[]) => {
      this.accounts = accounts;
    });

    this.historyForm = this.fb.group({
      accountId: [''],
      search: ['']
    });

    this.historyForm.valueChanges.subscribe(() => {
      this.filterTransactions();
    });
  }

  filterTransactions(): void {
    const accountId = this.historyForm.get('accountId')?.value;
    const searchTerm = this.historyForm.get('search')?.value.toLowerCase();

    if (accountId) {
      this.transactions = this.transactionService.getTransactionsByAccount(+accountId);
    } else {
      this.transactions = [];
    }

    if (searchTerm) {
      this.filteredTransactions = this.transactions.filter(txn =>
        txn.description?.toLowerCase().includes(searchTerm) ||
        txn.type.toLowerCase().includes(searchTerm) ||
        txn.amount.toString().includes(searchTerm)
      );
    } else {
      this.filteredTransactions = this.transactions;
    }
  }
}
