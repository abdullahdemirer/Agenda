import * as moment from "moment";
import { Schedule } from "./schedule";

export class ScheduleManager {
    normalRenk: string // takvimdeki hücrelerin ilk arkaplan rengi
    rezervasyonRengi: string // rezervasyon eklediğinde gösterilecek arkaplan rengi
    abonelikRengi: string // abonelik eklediğinde gösterilecek arkaplan rengi

    zamanListesininUzunlugu: number // Uygulamada gösterilecek satır sayısı(zamanListesinin uzunluğu)

    aboneZamanVeTarihListesi: Array<Array<string>> = [[]]
    /* Array[zamanListesininUzunlugu][7] içerisinde haftanın her gününü temsil etmek amacıyla bir sütun
    (toplam 7 sutun), zaman tablosundaki her bir zamanı temsil etmek amacıylada bir satır bulunmaktadır. */
    arananGun: string;
    /* kullanıcının zamanı ileri veya geri aldığında oluşturalacak yeni kullaniciyaGosterilecekListesindeki
    duruma göre ilk veya son tarihtir.*/
    
    tarihFormati: string // ekranda gösterilecek tarihlerin formatı (DD.MM.YYYY, vb.) 

    constructor(uzunluk: number, normalRenk: string, rezervasyonRengi: string, abonelikRengi: string, tarihFormati: string) {
        this.zamanListesininUzunlugu = uzunluk;
        this.normalRenk = normalRenk;
        this.rezervasyonRengi = rezervasyonRengi;
        this.abonelikRengi = abonelikRengi;
        this.tarihFormati = tarihFormati;
        this.aboneZamanVeTarihListesi = AboneListesiOlustur(this.zamanListesininUzunlugu)
    }

    // Uygulama ilk açıldığında kullanıcıya gösterilen 20 günlük listeyi oluşturuyor.
    ilkListeyiOlustur(guncelTarih: string, gunSayisi: number): Array<Schedule> {
        let gunler: Array<Schedule> = []
        for (let i = 0; i < gunSayisi; i++) {
            let yeniTarih = moment(guncelTarih, this.tarihFormati).add(i, "days").format(this.tarihFormati)
            gunler.push({
                tarih: yeniTarih,
                rezervasyonlar: varsayilanBoolListesiOlustur(this.zamanListesininUzunlugu),
                abonelikler: varsayilanBoolListesiOlustur(this.zamanListesininUzunlugu),
                zamanListesi: [],
                arkaPlanRenkleri: varsayilanArkaPlanRenkListesiOlustur(this.zamanListesininUzunlugu, this.normalRenk)
            })
        }

        return gunler;
    }

    // kullaniciyaGosterilecekListe'nin en başına zaman sutununu ekliyor.
    ZamanSutunuEkle(kullaniciyaGosterilecekListe: Schedule[], zamanlar: string[]): Array<Schedule> {
        kullaniciyaGosterilecekListe.unshift({
            tarih: "",
            rezervasyonlar: [],
            abonelikler: [],
            zamanListesi: zamanlar,
            arkaPlanRenkleri: varsayilanArkaPlanRenkListesiOlustur(this.zamanListesininUzunlugu, this.normalRenk)
        })
        return kullaniciyaGosterilecekListe;
    }

    /* zamanı geriye aldığımızda  kullanıcya gösterilecek olan tarihin listede olup olmadığını kontrol eder,
    eğer gösterilecek olacak tarih listede yoksa tümgünler listesinin en başına tarih ekleme işlemini yapıyor*/
    listeBasinaGunEkle(tumGunler: Schedule[], ilkGun: string, cikartilacakGunSayisi: number): Schedule[] {
        this.arananGun = moment(ilkGun, this.tarihFormati).subtract(cikartilacakGunSayisi, "days").format(this.tarihFormati)

        if (this.listedeGunAra(tumGunler, this.arananGun) == -1) {

            for (let i = 0; i < cikartilacakGunSayisi; i++) {
                let eklenenTarih = moment(tumGunler[0].tarih, this.tarihFormati).subtract(1, "days").format(this.tarihFormati)


                let abonelikListesi = eklenenTarihIcinAbonelikKontrolu(eklenenTarih, this.aboneZamanVeTarihListesi, this.zamanListesininUzunlugu, this.tarihFormati)
                let arkaplanRenkListesi = eklenenTarihIcinArkaPlanRengiOlustur(abonelikListesi, this.normalRenk, this.abonelikRengi)
                tumGunler.unshift({
                    tarih: eklenenTarih,
                    rezervasyonlar: varsayilanBoolListesiOlustur(this.zamanListesininUzunlugu),
                    abonelikler: abonelikListesi,
                    zamanListesi: [],
                    arkaPlanRenkleri: arkaplanRenkListesi,
                })
            }

        }

        return tumGunler;
    }

    /* zamanı ileriye aldığımızda  kullanıcya gösterilecek olan tarihin listede olup olmadığını kontrol eder,
    eğer gösterilecek olacak tarih listede yoksa tümgünler listesinin en sonuna tarih ekleme işlemini yapıyor*/
    listeSonunaGunEkle(tumGunler: Schedule[], sonGun: string, eklenecekGunSayisi: number): Schedule[] {
        this.arananGun = moment(sonGun, this.tarihFormati).add(eklenecekGunSayisi, "days").format(this.tarihFormati)

        if (this.listedeGunAra(tumGunler, this.arananGun) == -1) {
            for (let i = 0; i < eklenecekGunSayisi; i++) {

                let eklenenTarih = moment(tumGunler[tumGunler.length - 1].tarih, this.tarihFormati).add(1, "days").format(this.tarihFormati)
                let abonelikListesi = eklenenTarihIcinAbonelikKontrolu(eklenenTarih, this.aboneZamanVeTarihListesi, this.zamanListesininUzunlugu, this.tarihFormati)
                let arkaplanRenkListesi = eklenenTarihIcinArkaPlanRengiOlustur(abonelikListesi, this.normalRenk, this.abonelikRengi)
                tumGunler.push({
                    tarih: eklenenTarih,
                    rezervasyonlar: varsayilanBoolListesiOlustur(this.zamanListesininUzunlugu),
                    abonelikler: abonelikListesi,
                    zamanListesi: [],
                    arkaPlanRenkleri: arkaplanRenkListesi,
                })
            }

        }
        return tumGunler;

    }

    // tumGunler listesine gün eklerken eklenecek olan en son günün listede olup olmadığını kontrol ediyor.
    listedeGunAra(tumGunler: Schedule[], arananTarih: string): number {
        let index = -1
        for (let i = 0; i < tumGunler.length; i++) {
            if (tumGunler[i].tarih == arananTarih) {
                index = i
                break
            }
        }
        return index
    }

    // kullanıcı bugün butonuna tıkladığı zaman tüm abonelikleri sıfırlama işlemi yapılıyor
    aboneListeniTemizle() {
        for (let i = 0; i < this.zamanListesininUzunlugu; i++) {
            for (let j = 0; j < 7; j++) {
                this.aboneZamanVeTarihListesi[i][j] = ""
            }
        }
    }

    /* kullanıcı abonelik veya rezervasyon olmayan bir tarihe ait hücreye tıkladığında abonelik veya rezervasyon
     işlemleri yapılıyor.*/
    abonelikRezervasyonEkle(tumGunler: Schedule[], secilmisGun: Schedule, satirIndeksi: number) {
        let cevap = confirm("Abonelik mi?")
        let pozisyon = tumGunler.indexOf(secilmisGun);
        if (cevap) {
            for (let i = pozisyon % 7; i < tumGunler.length; i = i + 7) {
                if (tumGunler[i].abonelikler[satirIndeksi] == false) {
                    tumGunler[i].abonelikler[satirIndeksi] = true
                    tumGunler[i].arkaPlanRenkleri[satirIndeksi] = this.abonelikRengi;
                }
            }
            abonelikListesineTarihEkle(secilmisGun.tarih, this.aboneZamanVeTarihListesi, satirIndeksi, this.tarihFormati)
        } else {
            tumGunler[pozisyon].rezervasyonlar[satirIndeksi] = true
            tumGunler[pozisyon].arkaPlanRenkleri[satirIndeksi] = this.rezervasyonRengi;
        }
    }

    /* kullanıcı rezervasyon olan  bir tarihe ait hücreye tıkladığında hücreden rezervasyonun kaldırılmasıyla 
     ilgili  işlemler yapılıyor.*/
    rezervasyonIptalEt(tumGunler: Schedule[], secilmisGun: Schedule, satirIndeksi: number) {
        let cevap = confirm("Silinsin mi?")
        let pozisyon = tumGunler.indexOf(secilmisGun);
        if (cevap) {
            tumGunler[pozisyon].rezervasyonlar[satirIndeksi] = false
            tumGunler[pozisyon].arkaPlanRenkleri[satirIndeksi] = this.normalRenk;
        }
    }

    /* Takvimdeki tüm aboneliklerin veya tıklanılan hücreye ait aboneliğin kaldırılması işlemleri yapılıyor.*/
    abonelikIptalEt(tumGunler: Schedule[], secilmisGun: Schedule, satirIndeksi: number) {
        let pozisyon = tumGunler.indexOf(secilmisGun);
        let cevap = confirm("Silinsin mi?")
        if (cevap) {
            let cevap2 = confirm("Abonelik silinsin mi?")
            if (cevap2) {
                for (let i = pozisyon % 7; i < tumGunler.length; i = i + 7) {
                    arkaPlanRenginiBelirle(tumGunler[i], satirIndeksi, this.normalRenk, this.rezervasyonRengi)
                }
                abonelikListesindenTarihSil(secilmisGun.tarih, this.aboneZamanVeTarihListesi, satirIndeksi, this.tarihFormati)
            } else {
                arkaPlanRenginiBelirle(tumGunler[pozisyon], satirIndeksi, this.normalRenk, this.rezervasyonRengi)
            }
        }
    }
}

/* tüm elemanları false olan bir liste oluşturuyor.-- Uygulama ilk açıldığında rezervasyon ve abonelik 
listesi için */
function varsayilanBoolListesiOlustur(zamanSayisi: number): boolean[] {
    let boolListesi: Array<boolean> = []
    for (let i = 0; i < zamanSayisi; i++) {
        boolListesi.push(false)
    }
    return boolListesi;
}

//Uygulama ilk açıldığında oluşturulan hücrelerin arkaplanı normalRenk olarak ayarlıyor.
function varsayilanArkaPlanRenkListesiOlustur(zamanSayisi: number, renk: string): string[] {
    let renkListesi: Array<string> = []
    for (let i = 0; i < zamanSayisi; i++) {
        renkListesi.push(renk)
    }
    return renkListesi;
}

//aboneZamanVeTarihListesi için içi boş 2 boyutlu([zamanListesinin_uzunluğu][7]) bir array oluşturuyor.
function AboneListesiOlustur(uzunluk: number): string[][] {
    let aboneListesi = []
    for (let i = 0; i < uzunluk; i++) {
        let altListe = new Array()
        for (let j = 0; j <= 7; j++) {
            altListe.push("")
        }
        aboneListesi.push(altListe)
    }
    return aboneListesi;
}


/* eklenen yeni tarih aboneZamanVeTarihListesi listeninde kontrol edilerek herbir satır için true yada false
 içiren bir array oluşturuyor.*/
function eklenenTarihIcinAbonelikKontrolu(eklenenTarih: string, aboneZamanVeTarihListesi: string[][], uzunluk: number, tarihFormati: string): boolean[] {
    var abonelikBoolListesi = []
    for (let i = 0; i < uzunluk; i++) {
        let check = false;
        for (let j = 0; j < 7; j++) {
            if (aboneZamanVeTarihListesi[i][j] != "") {
                if (tarihleriKarsilastir(aboneZamanVeTarihListesi[i][j], eklenenTarih, tarihFormati)) {
                    check = true;
                    break
                }
            }
        }
        abonelikBoolListesi.push(check)
    }
    return abonelikBoolListesi;
}

/* iki tarihin birbirinin katı olup olmadığı belirleniyor. */
function tarihleriKarsilastir(aboneOlunmusTarih: string, eklenenTarih: string, tarihFormati: string): boolean {
    var gunSayisi = Math.abs(moment(aboneOlunmusTarih, tarihFormati).diff(moment(eklenenTarih, tarihFormati), "days"))
    if (gunSayisi % 7 == 0) {
        return true;
    }

    return false;

}

/* eklenenTarihIcinAbonelikKontrolu methodundan dönen boolean array yardımıyla yeni eklenecek tarihin arkaplan 
renklerini belirliyor.*/
function eklenenTarihIcinArkaPlanRengiOlustur(abonelikListesi: boolean[], normalRenk: string, abonelikRengi: string) {
    var arkaplanRenkListesi = [];
    for (let i = 0; i < abonelikListesi.length; i++) {
        if (abonelikListesi[i]) {
            arkaplanRenkListesi.push(abonelikRengi)
        } else {
            arkaplanRenkListesi.push(normalRenk)
        }
    }
    return arkaplanRenkListesi;
}

/*Abonelik eklendiği  zaman tıklanılan hücreye ait tarihin katı aboneZamanVeTarihListesinde yoksa 
aboneZamanVeTarihListesine listene ekleniyor.*/
function abonelikListesineTarihEkle(tarih: string, aboneZamanVeTarihListesi: string[][], satirIndeksi: number, tarihFormati: string) {
    let kontrol: boolean = false;
    for (let i = 0; i < 7; i++) {
        if (aboneZamanVeTarihListesi[satirIndeksi][i] != "") {
            if (tarihleriKarsilastir(aboneZamanVeTarihListesi[satirIndeksi][i], tarih, tarihFormati)) {
                kontrol = true;
                break;
            }
        }
    }

    if (!kontrol) {
        for (let i = 0; i < 7; i++) {
            if (aboneZamanVeTarihListesi[satirIndeksi][i] == "") {
                aboneZamanVeTarihListesi[satirIndeksi][i] = tarih;
                break;
            }
        }
    }
}

/*Abonelik kaldırıldığı zaman tıklanılan hücreye ait tarihin katı aboneZamanVeTarihListesinde bulunarak
 listeden siliniyor.*/
function abonelikListesindenTarihSil(tarih: string, aboneZamanVeTarihListesi: string[][], satirIndeksi: number, tarihFormati: string) {
    for (let i = 0; i < 7; i++) {
        if (aboneZamanVeTarihListesi[satirIndeksi][i] != "") {
            if (tarihleriKarsilastir(aboneZamanVeTarihListesi[satirIndeksi][i], tarih, tarihFormati)) {
                aboneZamanVeTarihListesi[satirIndeksi][i] = ""
                break;
            }
        }
    }

}

/*Abonelikten çıkan bir tarihin rezervasyonu varsa arkaplan rengi rezervasyonRengi aksi halde normalRenk 
olarak ayarlıyor.*/
function arkaPlanRenginiBelirle(gun: Schedule, indeks: number, normalRenk: string, rezervasyonRengi: string) {
    gun.abonelikler[indeks] = false;
    if (gun.rezervasyonlar[indeks]) {
        gun.arkaPlanRenkleri[indeks] = rezervasyonRengi;
    } else {
        gun.arkaPlanRenkleri[indeks] = normalRenk;
    }
}

