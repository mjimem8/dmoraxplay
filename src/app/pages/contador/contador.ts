import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HashService } from 'src/app/services/hash.service';
import { FirebaseService } from 'src/app/services/firebase.service';

interface Usuario {
  tiktok: string,
  twitch: string,
  instagram: string,
  youtube: string,
  ip: string,
  id: string,
  orden: number
}
const PASSWORD_STORAGE = 'PASSWORD_STORAGE';
const PASSWORD_ADMIN = '704397808567835407';

@Component({
  selector: 'contador',
  templateUrl: './contador.html',
  styleUrls: ['./contador.scss']
})
export class Contador implements OnInit {
  public admin = '';
  public pendientesPorJugar: Array<Usuario> = [];
  public historico: Array<Usuario> = [];
  public edition = false; 

  public usuarioPendiente: Usuario = {
    tiktok: '',
    twitch: '',
    instagram: '',
    youtube: '',
    ip: '',
    id: '',
    orden: 0
  };

  private ipApiUrl = 'https://api.ipify.org?format=json';
  private ipAddressHashed = '';

  constructor(
    private http: HttpClient,
    private hashService: HashService,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.getIp().subscribe(
      async data => {
        this.ipAddressHashed = await this.hashService.hashData(data.ip);
        this.setPendientesPorJugar();
      }
    );
  }
  
  public setModeEdition(usuarioPendiente: Usuario) {
    this.edition = true;
    this.usuarioPendiente = usuarioPendiente;
  }

  public async submitForm() {
    if (this.edition) {
      await this.firebaseService.actualizarPendiente(this.usuarioPendiente.id, this.usuarioPendiente);
      this.setPendientesPorJugar();
      this.edition = false;
      this.resetFormUsuarioPendiente();
      return;
    }

    this.usuarioPendiente.ip = this.isAdmin() ? '' : this.ipAddressHashed;
    const ordenMasAlto = this.pendientesPorJugar.reduce((max, obj) => obj.orden > max.orden ? obj : max).orden;
    this.usuarioPendiente.orden = ordenMasAlto + 1;
    await this.firebaseService.agregarPendiente(this.usuarioPendiente);
    this.setPendientesPorJugar();
    this.resetFormUsuarioPendiente();
  }

  public async editarPendiente(usuarioPendiente: Usuario) {
    await this.firebaseService.eliminarPendiente(usuarioPendiente.id);
    this.setPendientesPorJugar();
    //lo muestra en el formulario
    this.usuarioPendiente = usuarioPendiente;
  }

  public async eliminarPendiente(usuarioPendiente: Usuario) {
    await this.firebaseService.eliminarPendiente(usuarioPendiente.id);
    this.setPendientesPorJugar();
    this.resetFormUsuarioPendiente();

    if (this.isAdmin()) {
      //TODO: a añadir tabla con BBDD
      this.historico.push(usuarioPendiente);
    }
  }

  public puedeAnadirAPendientes(): boolean {
    return !this.existeIpEnPendientes() || this.isAdmin() || this.edition;
  }

  public puedeModificarAcciones(ip: string): boolean {
    return ip === this.ipAddressHashed || this.isAdmin();
  }

  public resetHistorico() {
    this.historico = [];
  }

  public passAdmin() {
    if (this.admin === PASSWORD_ADMIN) {
      localStorage.setItem(PASSWORD_STORAGE, this.admin);
    }
  }

  public isAdmin(): boolean {
    return localStorage.getItem(PASSWORD_STORAGE) === PASSWORD_ADMIN;
  }

  public cerrarSesion() {
    localStorage.removeItem(PASSWORD_STORAGE);
  }

  private existeIpEnPendientes(): boolean {
    return this.pendientesPorJugar.some(pendiente => pendiente.ip === this.ipAddressHashed);
  }

  private getIp(): Observable<any> {
    return this.http.get<any>(this.ipApiUrl);
  }

  private resetFormUsuarioPendiente() {
    this.usuarioPendiente = {
      tiktok: '',
      twitch: '',
      instagram: '',
      youtube: '',
      ip: '',
      id: '',
      orden: 0
    };
  }

  private async setPendientesPorJugar() {
    this.pendientesPorJugar = await this.firebaseService.getPendientes() as Usuario[];
    this.pendientesPorJugar = this.pendientesPorJugar.sort((a, b) => a.orden - b.orden);
  }
}
