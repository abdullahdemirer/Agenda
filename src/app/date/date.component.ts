import { Component, OnInit } from '@angular/core';
import { VirtualTimeScheduler } from 'rxjs';
import { Schedule } from './schedule';
import { ScheduleManager } from './scheduleManager';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit {
  tümGünler: Array<Schedule> = [] // kullanıcıya gösterilen tüm günlerin tutulduğu liste 
  kullaniciyaGosterilecekListe: Array<Schedule> = [] // kullanıcıya gösterilecek 20 günü tutan liste
  zamanListesi: Array<string> = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

  manager = new ScheduleManager(this.zamanListesi.length, "white", "lightblue", "blue");

  constructor() {
    this.tümGünler = this.manager.ilkListeyiOlustur(new Date(), 20);
    this.kullaniciyaGosterilecekListe = this.tümGünler.slice();
    this.kullaniciyaGosterilecekListe = this.manager.ZamanSutunuEkle(this.kullaniciyaGosterilecekListe, this.zamanListesi)
  }

  ngOnInit(): void {

  }
  birHaftaGeriyeAl() {
    let ilkgün = this.kullaniciyaGosterilecekListe[1].tarih;
    this.tümGünler = this.manager.listeBasinaGunEkle(this.tümGünler, ilkgün, 7);
    let aranagününIndeksi = this.manager.listedeGunAra(this.tümGünler, this.manager.arananGun)
    this.kullaniciyaGosterilecekListe = this.tümGünler.slice(aranagününIndeksi, aranagününIndeksi + 20)
    this.kullaniciyaGosterilecekListe = this.manager.ZamanSutunuEkle(this.kullaniciyaGosterilecekListe, this.zamanListesi)

  }
  birGunGeriyeAl() {
    let ilkgün = this.kullaniciyaGosterilecekListe[1].tarih;
    this.tümGünler = this.manager.listeBasinaGunEkle(this.tümGünler, ilkgün, 1);
    let aranagününIndeksi = this.manager.listedeGunAra(this.tümGünler, this.manager.arananGun)
    this.kullaniciyaGosterilecekListe = this.tümGünler.slice(aranagününIndeksi, aranagününIndeksi + 20)
    this.kullaniciyaGosterilecekListe = this.manager.ZamanSutunuEkle(this.kullaniciyaGosterilecekListe, this.zamanListesi)
  }
  bugunuGoster() {
    this.manager.aboneListeniTemizle();
    this.tümGünler = this.manager.ilkListeyiOlustur(new Date(), 20);
    this.kullaniciyaGosterilecekListe = this.tümGünler.slice();
    this.kullaniciyaGosterilecekListe = this.manager.ZamanSutunuEkle(this.kullaniciyaGosterilecekListe, this.zamanListesi)

  }
  birGunIleriyeAl() {
    let songün = this.kullaniciyaGosterilecekListe[this.kullaniciyaGosterilecekListe.length - 1].tarih;
    this.tümGünler = this.manager.listeSonunaGunEkle(this.tümGünler, songün, 1);
    let aranagününIndeksi = this.manager.listedeGunAra(this.tümGünler, this.manager.arananGun)
    this.kullaniciyaGosterilecekListe = this.tümGünler.slice(aranagününIndeksi - 19, aranagününIndeksi + 1)
    this.kullaniciyaGosterilecekListe = this.manager.ZamanSutunuEkle(this.kullaniciyaGosterilecekListe, this.zamanListesi)
  }
  birHaftaIleriyeAl() {
    let songün = this.kullaniciyaGosterilecekListe[this.kullaniciyaGosterilecekListe.length - 1].tarih;
    this.tümGünler = this.manager.listeSonunaGunEkle(this.tümGünler, songün, 7);
    let aranagününIndeksi = this.manager.listedeGunAra(this.tümGünler, this.manager.arananGun)
    this.kullaniciyaGosterilecekListe = this.tümGünler.slice(aranagününIndeksi - 19, aranagününIndeksi + 1)
    this.kullaniciyaGosterilecekListe = this.manager.ZamanSutunuEkle(this.kullaniciyaGosterilecekListe, this.zamanListesi)
  }
  clickOn(secilmisGün: Schedule, zamanIndeksi: number) {
    if (secilmisGün.tarih != "") {
      if (secilmisGün.abonelikler[zamanIndeksi]) { // günde abonelik var ise 
        this.manager.abonelikIptalEt(this.tümGünler, secilmisGün, zamanIndeksi)
      } else if (secilmisGün.rezervasyonlar[zamanIndeksi]) { // günde revervazyon var ise 
        this.manager.rezervasyonIptalEt(this.tümGünler, secilmisGün, zamanIndeksi)
      } else { // abonelik ve Rezervazyon yok ise ... 
        this.manager.abonelikRezervasyonEkle(this.tümGünler, secilmisGün, zamanIndeksi)
      }
    }
  }
}

