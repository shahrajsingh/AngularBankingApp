import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AccountService } from '../../../core/services/account.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { Account } from '../../../core/models/account.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fund-transfer',
  standalone: false,
  templateUrl: './fund-transfer.component.html',
  styleUrl: './fund-transfer.component.scss'
})
export class FundTransferComponent implements OnInit {
  fundTransferForm: FormGroup = new FormGroup({});
  accounts: Account[] = [];
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.accountService.getAccounts().subscribe((accounts: Account[]) => {
      this.accounts = accounts;
    });

    this.fundTransferForm = this.fb.group({
      fromAccount: ['', Validators.required],
      toAccount: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]]
    }, { validators: this.accountsDifferentValidator });
  }

  accountsDifferentValidator(formGroup: FormGroup) {
    const fromAccount = formGroup.get('fromAccount')?.value;
    const toAccount = formGroup.get('toAccount')?.value;
    return fromAccount && toAccount && fromAccount === toAccount ? { sameAccount: true } : null;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.fundTransferForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.fundTransferForm.invalid) {
      return;
    }

    const { fromAccount, toAccount, amount } = this.fundTransferForm.value;
    const senderAccount = this.accountService.getAccountById(+fromAccount);
    if (!senderAccount) {
      this.snackBar.open('Sender account not found.', 'Close', { duration: 3000 });
      return;
    }

    if (amount > senderAccount.balance) {
      this.snackBar.open('Transfer amount exceeds available balance.', 'Close', { duration: 3000 });
      return;
    }

    const transferSuccess = this.transactionService.transferFunds(+fromAccount, +toAccount, amount);
    if (transferSuccess) {
      this.snackBar.open('Fund transfer successful!', 'Close', { duration: 3000 });
      this.fundTransferForm.reset();
      this.submitted = false;
    } else {
      this.snackBar.open('Fund transfer failed. Please check the details.', 'Close', { duration: 3000 });
    }
  }
}
