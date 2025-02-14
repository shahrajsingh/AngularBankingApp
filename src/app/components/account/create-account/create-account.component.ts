import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Account } from '../../../core/models/account.model';
import { AccountService } from '../../../core/services/account.service';
import { Observable, of, debounceTime, first, map, catchError } from 'rxjs';

@Component({
  selector: 'app-create-account',
  standalone: false,
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {
  accountForm: FormGroup = new FormGroup({});
  accountButtonColor: 'Chequing' | 'Savings' = "Chequing";
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.accountForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)], [this.uniqueAccountNameValidator(this.accountService)]],
      initialBalance: [0, [Validators.required, Validators.min(0)]],
      accountType: ['Chequing', Validators.required]
    });

    this.f.accountType.valueChanges.subscribe((value: 'Chequing' | 'Savings') => {
      this.accountButtonColor = value;
    });
  }

  get f(): { 
    name: AbstractControl; 
    initialBalance: AbstractControl; 
    accountType: AbstractControl;
  } {
    return this.accountForm.controls as { 
      name: AbstractControl; 
      initialBalance: AbstractControl; 
      accountType: AbstractControl;
    };
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.accountForm.invalid) {
      return;
    }
  
    const { name, initialBalance, accountType } = this.accountForm.value;
    const newAccount: Account = this.accountService.createAccount(name, accountType, initialBalance);
  
    this.accountForm.reset({
      name: '',
      initialBalance: 0,
      accountType: 'Chequing'
    });
    this.accountForm.markAsPristine();
    this.accountForm.markAsUntouched();
    this.accountForm.updateValueAndValidity();
  
    this.submitted = false;
    
    this.snackBar.open(`Account created successfully! (ID: ${newAccount.id})`, 'Close', {
      duration: 3000
    });
  }

  uniqueAccountNameValidator(accountService: AccountService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
  
      return accountService.getAccounts().pipe(
        debounceTime(300),
        first(),
        map((accounts: Account[]) => {
          const exists = accounts.some(account => account.name.trim().toLowerCase() === control.value.trim().toLowerCase());
          return exists ? { uniqueAccountName: true } : null;
        }),
        catchError(() => of(null))
      );
    };
  }
}
