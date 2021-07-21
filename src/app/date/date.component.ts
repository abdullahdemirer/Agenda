import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
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

  tarihFormati = "DD.MM.YYYY"
  manager = new ScheduleManager(this.zamanListesi.length, "white", "lightblue", "blue", this.tarihFormati);

  constructor() {
    this.tumGunler = this.manager.ilkListeyiOlustur(moment().format(this.tarihFormati), 20);
    this.kullaniciyaGosterilecekListe = this.tumGunler.slice();
    this.kullaniciyaGosterilecekListe = this.manager.ZamanSutunuEkle(this.kullaniciyaGosterilecekListe, this.zamanListesi)
  }

  ngOnInit(): void {
    document.getElementById('table').style.backgroundColor = this.manager.normalRenk
    document.getElementById('caption').style.backgroundColor = this.manager.normalRenk
  }
  /* Zamanı geri alma işlemlerinde listeye gerekli olan yeni tarihleri tümGunler listenin en başına sırasıyla 
   ekledikten sonra tümGunler listesininden arananGunun indeksinden başlayarak yeni 
   kullaniciyaGosterilecekListe oluşturulur.*/
  birHaftaGeriyeAl() {
    let ilkGun = this.kullaniciyaGosterilecekListe[1].tarih;
    this.tumGunler = this.manager.listeBasinaGunEkle(this.tumGunler, ilkGun, 7);
    let arananGununIndeksi = this.manager.listedeGunAra(this.tumGunler, this.manager.arananGun)
    this.kullaniciyaGosterilecekListe = yeniListeOlustur(this.manager, this.tumGunler, this.zamanListesi, arananGununIndeksi)
  }
  birGunGeriyeAl() {
    let ilkGun = this.kullaniciyaGosterilecekListe[1].tarih;
    this.tumGunler = this.manager.listeBasinaGunEkle(this.tumGunler, ilkGun, 1);
    let arananGununIndeksi = this.manager.listedeGunAra(this.tumGunler, this.manager.arananGun)
    this.kullaniciyaGosterilecekListe = yeniListeOlustur(this.manager, this.tumGunler, this.zamanListesi, arananGununIndeksi)
  }
  bugunuGoster() {
    this.manager.aboneListesiniTemizle();
    this.tumGunler = this.manager.ilkListeyiOlustur(moment().format(this.tarihFormati), 20);
    this.kullaniciyaGosterilecekListe = this.tumGunler.slice();
    this.kullaniciyaGosterilecekListe = this.manager.ZamanSutunuEkle(this.kullaniciyaGosterilecekListe, this.zamanListesi)

  }

  /* Zamanı ileri alma işlemlerinde listeye gerekli olan yeni tarihleri tümGunler listenin en sonuna sırasıyla 
    ekledikten sonra arananGun, oluşturulacak olan yeni kullaniciyaGosterilecekListesini son elemanı olacak 
    şekilde sırasıyla tarihler eklenir.*/
  birGunIleriyeAl() {
    let sonGun = this.kullaniciyaGosterilecekListe[this.kullaniciyaGosterilecekListe.length - 1].tarih;
    this.tumGunler = this.manager.listeSonunaGunEkle(this.tumGunler, sonGun, 1);
    let arananGununIndeksi = this.manager.listedeGunAra(this.tumGunler, this.manager.arananGun)
    this.kullaniciyaGosterilecekListe = yeniListeOlustur(this.manager, this.tumGunler, this.zamanListesi, arananGununIndeksi - 19)
  }
  birHaftaIleriyeAl() {
    let sonGun = this.kullaniciyaGosterilecekListe[this.kullaniciyaGosterilecekListe.length - 1].tarih;
    this.tumGunler = this.manager.listeSonunaGunEkle(this.tumGunler, sonGun, 7);
    let arananGununIndeksi = this.manager.listedeGunAra(this.tumGunler, this.manager.arananGun)
    this.kullaniciyaGosterilecekListe = yeniListeOlustur(this.manager, this.tumGunler, this.zamanListesi, arananGununIndeksi - 19)
  }
  clickOn(secilmisGun: Schedule, satirIndeksi: number) {
    if (secilmisGun.tarih != "") {
      if (secilmisGun.abonelikler[satirIndeksi]) { // tarihe ait tıklanan satırda  abonelik var ise 
        this.manager.abonelikIptalEt(this.tumGunler, secilmisGun, satirIndeksi)
      } else if (secilmisGun.rezervasyonlar[satirIndeksi]) { // günde revervazyon var ise 
        this.manager.rezervasyonIptalEt(this.tumGunler, secilmisGun, satirIndeksi)
      } else { // abonelik ve Rezervazyon yok ise ... 
        this.manager.abonelikRezervasyonEkle(this.tumGunler, secilmisGun, satirIndeksi)
      }
    }
  }
}
// tarihi ileri geri alma işlemlerindne sonra kullaniciyaGosterilecekListe'si güncelleniyor.
function yeniListeOlustur(manager: ScheduleManager, tumGunler: Schedule[], zamanListesi: string[], baslangicIndeksi: number): Schedule[] {
  let yeniKullaniciListesi = tumGunler.slice(baslangicIndeksi, baslangicIndeksi + 20)
  yeniKullaniciListesi = manager.ZamanSutunuEkle(yeniKullaniciListesi, zamanListesi)
  return yeniKullaniciListesi;
}


