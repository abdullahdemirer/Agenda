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
  tumGunler: Array<Schedule> = []
  // Kullanıcıya gösterilen tüm günler bu listede tutuluyor.Takvimi ileri veya geri alma işlemleri sırasında gösterilecek yeni tarih
  //listede bulunmuyor ise  duruma göre listenin  başına veya sonuna yeni tarih ekleniyor.
  
  kullaniciyaGosterilecekListe: Array<Schedule> = []
  // tüm günler listesinden 20 adet tarih kopyalanarak bu liste aracalığıyla  kullanıcıya  gösteriliyor.
  
  zamanListesi: Array<string> = [ 
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
  
  manager = new ScheduleManager(this.zamanListesi.length, "white", "lightblue", "blue");

  constructor() {
    this.tumGunler = this.manager.ilkListeyiOlustur(new Date(), 20);
    this.kullaniciyaGosterilecekListe = this.tumGunler.slice();
    this.kullaniciyaGosterilecekListe = this.manager.ZamanSutunuEkle(this.kullaniciyaGosterilecekListe, this.zamanListesi)
  }

  ngOnInit(): void {

  }
  birHaftaGeriyeAl() {
    let ilkGun = this.kullaniciyaGosterilecekListe[1].tarih;
    this.tumGunler = this.manager.listeBasinaGunEkle(this.tumGunler, ilkGun, 7);
    let arananGununIndeksi = this.manager.listedeGunAra(this.tumGunler, this.manager.arananGun)
    // listenin başına gerekli gün eklektikten sonra yeni kullaniciyaGosterilecekListe'si oluşturmak için eklenen son elemanın
    // tumGunler listesindeki indeksini buluyorum.
    this.kullaniciyaGosterilecekListe = this.tumGunler.slice(arananGununIndeksi, arananGununIndeksi + 20)
    //tumGunler listesinden belirlidiğim başlangıç indeksini kullanarak 20 objeyi kullaniciyaGosterilecekListe'sine kopyalıyorum.
    this.kullaniciyaGosterilecekListe = this.manager.ZamanSutunuEkle(this.kullaniciyaGosterilecekListe, this.zamanListesi)

  }
  birGunGeriyeAl() {
    let ilkGun = this.kullaniciyaGosterilecekListe[1].tarih;
    this.tumGunler = this.manager.listeBasinaGunEkle(this.tumGunler, ilkGun, 1);
    let arananGununIndeksi = this.manager.listedeGunAra(this.tumGunler, this.manager.arananGun)
    this.kullaniciyaGosterilecekListe = this.tumGunler.slice(arananGununIndeksi, arananGununIndeksi + 20)
    this.kullaniciyaGosterilecekListe = this.manager.ZamanSutunuEkle(this.kullaniciyaGosterilecekListe, this.zamanListesi)
  }
  bugunuGoster() {
    this.manager.aboneListeniTemizle();
    this.tumGunler = this.manager.ilkListeyiOlustur(new Date(), 20);
    this.kullaniciyaGosterilecekListe = this.tumGunler.slice();
    this.kullaniciyaGosterilecekListe = this.manager.ZamanSutunuEkle(this.kullaniciyaGosterilecekListe, this.zamanListesi)

  }
  birGunIleriyeAl() {
    let sonGun = this.kullaniciyaGosterilecekListe[this.kullaniciyaGosterilecekListe.length - 1].tarih;
    this.tumGunler = this.manager.listeSonunaGunEkle(this.tumGunler, sonGun, 1);
    let arananGununIndeksi = this.manager.listedeGunAra(this.tumGunler, this.manager.arananGun)
    this.kullaniciyaGosterilecekListe = this.tumGunler.slice(arananGununIndeksi - 19, arananGununIndeksi + 1)
    this.kullaniciyaGosterilecekListe = this.manager.ZamanSutunuEkle(this.kullaniciyaGosterilecekListe, this.zamanListesi)
  }
  birHaftaIleriyeAl() {
    let sonGun = this.kullaniciyaGosterilecekListe[this.kullaniciyaGosterilecekListe.length - 1].tarih;
    this.tumGunler = this.manager.listeSonunaGunEkle(this.tumGunler, sonGun, 7);
    let arananGununIndeksi = this.manager.listedeGunAra(this.tumGunler, this.manager.arananGun)
    this.kullaniciyaGosterilecekListe = this.tumGunler.slice(arananGununIndeksi - 19, arananGununIndeksi + 1)
    this.kullaniciyaGosterilecekListe = this.manager.ZamanSutunuEkle(this.kullaniciyaGosterilecekListe, this.zamanListesi)
  }
  clickOn(secilmisGun: Schedule, zamanIndeksi: number) {
    if (secilmisGun.tarih != "") {
      if (secilmisGun.abonelikler[zamanIndeksi]) { // günde abonelik var ise 
        this.manager.abonelikIptalEt(this.tumGunler, secilmisGun, zamanIndeksi)
      } else if (secilmisGun.rezervasyonlar[zamanIndeksi]) { // günde revervazyon var ise 
        this.manager.rezervasyonIptalEt(this.tumGunler, secilmisGun, zamanIndeksi)
      } else { // abonelik ve Rezervazyon yok ise ... 
        this.manager.abonelikRezervasyonEkle(this.tumGunler, secilmisGun, zamanIndeksi)
      }
    }
  }
}

