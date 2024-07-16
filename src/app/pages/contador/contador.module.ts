import { NgModule } from "@angular/core";
import { Contador } from "./contador";
import { CommonModule } from "@angular/common";
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ButtonModule } from "primeng/button";
import { HashService } from "src/app/services/hash.service";
import { FirebaseService } from "src/app/services/firebase.service";

@NgModule({
  declarations: [Contador],
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    FormsModule,
    HttpClientModule,
    ButtonModule
  ],
  providers: [
    HashService,
    FirebaseService
  ],
  exports: [Contador]
})
export class ContadorModule {}
