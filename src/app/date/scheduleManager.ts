import { Schedule } from "./schedule";

export class ScheduleManager {
    normalRenk: string // uygulama ilk açıldığında takvimdeki hücrelerin ilk rengi
    rezervasyonRengi: string // kullanıcı herhangi bir güne rezervasyon eklediğinde gösterilecek arkaplan rengi
    abonelikRengi: string // kullanıcı herhangi bir güne abonelik  eklediğinde gösterilecek arkaplan rengi

    zamanListesininUzunlugu: number // Programı dinamik olarak çalıştırmak için gün oluştururken bu uzunluğa göre
    // Schedule classının içindeki rezervasyon,abonelik ve arkaplan rengi gibi arrayleri oluşturuyorum.

    aboneZamanVeTarihListesi: Array<Array<string>> = [[]]
    /*  Array içerisinde haftanın her gününü temsil etmek amacıyla bir sütun(toplam 7 sutun), zaman tablosundaki her bir 
        zamanı temsil etmek amacıylada bir satır bulunmaktadır. 
        tumGunler listesine yeni bir tarih eklerken iç içe for döngüsü yardımıyla aboneZamanVeTarihListesindeki tarihler 
        ile eklenecek tarihleri karşıklaştırarak( iki günü birbirinden çıkarıp  mod 7 işlemi yaparak)  boolean bir abonelik 
        listesi oluşturuyorum.Daha sonra  bu liste aracılığıyla arkaplanRengini içeren bir liste oluşturuyorum.
    */

    arananGun: Date;
    // kullanıcının zamanı ileri veya geri sararken, duruma göre kullaniciyaGosterilecekListe'nin ilke veya son elemanıdır.
    // zamanı geriye alırken kullaniciyaGosterilecekListe'nin ilk elemanı
    // zamanı ileri alırken kullaniciyaGosterilecekListe'nin son elemanıdır.

    constructor(uzunluk: number, normalRenk: string, rezervasyonRengi: string, abonelikRengi: string) {
        this.zamanListesininUzunlugu = uzunluk;
        this.normalRenk = normalRenk;
        this.rezervasyonRengi = rezervasyonRengi;
        this.abonelikRengi = abonelikRengi;
        this.aboneZamanVeTarihListesi = AboneListesiOlustur(this.zamanListesininUzunlugu)
    }

    // Uygulama ilk açıldığında kullanıcıya gösterilen 20 günlük listeyi oluşturyorum.
    ilkListeyiOlustur(date: Date, gunSayısı: number): Array<Schedule> {
        let günler: Array<Schedule> = []
        for (let i = 0; i < gunSayısı; i++) {
            let today = gunEkle(date, i)
            günler.push({
                tarih: today.toLocaleDateString("tr-TR"),
                rezervasyonlar: varsayılanBoolListesiOlustur(this.zamanListesininUzunlugu),
                abonelikler: varsayılanBoolListesiOlustur(this.zamanListesininUzunlugu),
                zamanListesi: [],
                arkaPlanRenkleri: varsayılanArkaPlanRenkListesiOlustur(this.zamanListesininUzunlugu, this.normalRenk)
            })
        }

        return günler;
    }
    // kullaniciyaGosterilecekListe'nin en başına zaman sutununu ekliyorum.
    ZamanSutunuEkle(kullnıcıyaGosterilecekListe: Schedule[], zamanlar: string[]): Array<Schedule> {
        kullnıcıyaGosterilecekListe.unshift({
            tarih: "",
            rezervasyonlar: [],
            abonelikler: [],
            zamanListesi: zamanlar,
            arkaPlanRenkleri: varsayılanArkaPlanRenkListesiOlustur(this.zamanListesininUzunlugu, this.normalRenk)
        })
        return kullnıcıyaGosterilecekListe;
    }

    // zamanı geriye sardığımızda kullanıcya gösterilecek olan tarihin listede olup olmadığını, kontrol eder ,
    //eğer gösterilecek olacak tarih listede yoksa tümgünler listesinin en başına  tarih ekler.
    // yeni tarih eklerken eklenecek olan tarihi aboneZamanVeTarihListesinde kontrol ederek boolean bir abonelik listesi oluşturur.
    // oluşan bu boolean listeyi kullanarak arkaplanrengi oluşturuyorum.
    listeBasinaGunEkle(tumGunler: Schedule[], ilkGun: string, cıkartılacakGunSayısı: number): Schedule[] {
        this.arananGun = gunCıkar(tarihOlustur(ilkGun), cıkartılacakGunSayısı);
        if (this.listedeGunAra(tumGunler, this.arananGun) == -1) {

            for (let i = 0; i < cıkartılacakGunSayısı; i++) {

                let eklenenTarih = gunCıkar(tarihOlustur(tumGunler[0].tarih), 1);
                let abonelikListesi = eklenenTarihIcınAbonelikKontrolu(eklenenTarih, this.aboneZamanVeTarihListesi, this.zamanListesininUzunlugu)
                let arkaplanRenkListesi = eklenenTarihIcınArkaPlanRengiOlustur(abonelikListesi, this.normalRenk, this.abonelikRengi)
                tumGunler.unshift({
                    tarih: eklenenTarih.toLocaleDateString("tr-TR"),
                    rezervasyonlar: varsayılanBoolListesiOlustur(this.zamanListesininUzunlugu),
                    abonelikler: abonelikListesi,
                    zamanListesi: [],
                    arkaPlanRenkleri: arkaplanRenkListesi,
                })
            }

        }

        return tumGunler;
    }
    // zamanı ileriye  sardığımızda kullanıcya gösterilecek olan tarihin listede olup olmadığını, kontrol eder ,
    //eğer gösterilecek olacak tarih listede yoksa tümgünler listesinin en sonuna tarih ekler.
    // yeni tarih eklerken eklenecek olan tarihi aboneZamanVeTarihListesinde kontrol ederek boolean bir abonelik listesi oluşturur.
    // oluşan bu boolean listeyi kullanarak arkaplanrengi oluşturuyorum.
    listeSonunaGunEkle(tumGunler: Schedule[], sonGun: string, eklenecekGunSayisi: number): Schedule[] {
        this.arananGun = gunEkle(tarihOlustur(sonGun), eklenecekGunSayisi);

        if (this.listedeGunAra(tumGunler, this.arananGun) == -1) {
            for (let i = 0; i < eklenecekGunSayisi; i++) {

                let eklenenTarih = gunEkle(tarihOlustur(tumGunler[tumGunler.length - 1].tarih), 1);
                let abonelikListesi = eklenenTarihIcınAbonelikKontrolu(eklenenTarih, this.aboneZamanVeTarihListesi, this.zamanListesininUzunlugu)
                let arkaplanRenkListesi = eklenenTarihIcınArkaPlanRengiOlustur(abonelikListesi, this.normalRenk, this.abonelikRengi)
                tumGunler.push({
                    tarih: eklenenTarih.toLocaleDateString("tr-TR"),
                    rezervasyonlar: varsayılanBoolListesiOlustur(this.zamanListesininUzunlugu),
                    abonelikler: abonelikListesi,
                    zamanListesi: [],
                    arkaPlanRenkleri: arkaplanRenkListesi,
                })
            }

        }
        return tumGunler;

    }

    // Listede gün eklerken eklenecek olan en son günün listede olup olmadığını kontrol eder.
    listedeGunAra(tumGunler: Schedule[], arananTarih: Date): number {
        let index = -1
        for (let i = 0; i < tumGunler.length; i++) {
            if (tumGunler[i].tarih == arananTarih.toLocaleDateString("tr-TR")) {
                index = i
                break
            }
        }
        return index
    }
    // kullanıcı bugün butonuna tıkladığı zaman tüm abonelikleri sıfırlamak için kullanıyorum.
    aboneListeniTemizle() {
        for (let i = 0; i < this.zamanListesininUzunlugu; i++) {
            for (let j = 0; j < 7; j++) {
                this.aboneZamanVeTarihListesi[i][j] = ""
            }
        }
    }

    // kullanıcı abonelik veya rezervasyon olmayan bir tarihe ait kutuya tıkladığında abonelik veya rezervasyon işlemleri
    // yapılıyor. Abonelik olduğu zaman seçilen tarih aboneZamanVeTarihListesindeki'ne kaydediliyor.
    abonelikRezervasyonEkle(tumGunler: Schedule[], secilmisGün: Schedule, zamanIndeksi: number) {
        let cevap = confirm("Abonelik mi?")
        let pozisyon = tumGunler.indexOf(secilmisGün);
        if (cevap) {
            for (let i = pozisyon % 7; i < tumGunler.length; i = i + 7) {
                if (tumGunler[i].abonelikler[zamanIndeksi] == false) {
                    tumGunler[i].abonelikler[zamanIndeksi] = true
                    tumGunler[i].arkaPlanRenkleri[zamanIndeksi] = this.abonelikRengi;
                }
            }
            abonelikListesineTarihEkle(secilmisGün.tarih, this.aboneZamanVeTarihListesi, zamanIndeksi)
        } else {
            tumGunler[pozisyon].rezervasyonlar[zamanIndeksi] = true
            tumGunler[pozisyon].arkaPlanRenkleri[zamanIndeksi] = this.rezervasyonRengi;
        }
    }

    // kullanıcı önceden rezervasyon yapılmış bir tarihe ait kutuya tıkladığı zaman,  tıklanılan hücreye ait  tarihten
    // rezervasyonun kaldırılmasıyla  ilgili  işlemler yapılıyor.
    rezervasyonIptalEt(tumGunler: Schedule[], secilmisGün: Schedule, zamanIndeksi: number) {
        let cevap = confirm("Silinsin mi?")
        let pozisyon = tumGunler.indexOf(secilmisGün);
        if (cevap) {
            tumGunler[pozisyon].rezervasyonlar[zamanIndeksi] = false
            tumGunler[pozisyon].arkaPlanRenkleri[zamanIndeksi] = this.normalRenk;
        }
    }

    // kullanıcı önceden abone olunmuş bir tarihe ait kutuya tıkladığı zaman, Takvimdeki tüm aboneliklerin veya tıklanılan hücreye
    // ait aboneliğin  kaldırılması işlemleri yapılıyor. Abonelik iptal edildiği zaman  aboneZamanVeTarihListesindeki abonelik siliniyor.
    abonelikIptalEt(tumGunler: Schedule[], secilmisGün: Schedule, zamanIndeksi: number) {
        let pozisyon = tumGunler.indexOf(secilmisGün);
        let cevap = confirm("Silinsin mi?")
        if (cevap) {
            let cevap2 = confirm("Abonelik silinsin mi?")
            if (cevap2) {
                for (let i = pozisyon % 7; i < tumGunler.length; i = i + 7) {
                    arkaPlanRenginiBelirle(tumGunler[i], zamanIndeksi, this.normalRenk, this.rezervasyonRengi)
                }
                abonelikListesindenTarihSil(secilmisGün.tarih, this.aboneZamanVeTarihListesi, zamanIndeksi)
            } else {
                arkaPlanRenginiBelirle(tumGunler[pozisyon], zamanIndeksi, this.normalRenk, this.rezervasyonRengi)
            }
        }
    }
}
function gunEkle(date: Date, days: number): Date {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function gunCıkar(date: Date, days: number): Date {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}

function varsayılanBoolListesiOlustur(zamanSayisi: number): boolean[] {
    let boolListesi: Array<boolean> = []
    for (let i = 0; i < zamanSayisi; i++) {
        boolListesi.push(false)
    }
    return boolListesi;
}
function varsayılanArkaPlanRenkListesiOlustur(zamanSayisi: number, renk: string): string[] {
    let renkListesi: Array<string> = []
    for (let i = 0; i < zamanSayisi; i++) {
        renkListesi.push(renk)
    }
    return renkListesi;
}

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
// string haldeki tarihi Date formatına çeviriyor.
function tarihOlustur(date: string): Date {
    var input = date.split(".")
    var day = parseInt(input[0], 10)
    var month = parseInt(input[1], 10)
    var year = parseInt(input[2], 10)
    var newdate = new Date(year, month - 1, day);
    return newdate;
}

function eklenenTarihIcınAbonelikKontrolu(eklenenTarih: Date, aboneZamanVeTarihListesi: string[][], uzunluk: number) {
    var abonelikBoolListesi = []
    for (let i = 0; i < uzunluk; i++) {
        let check = false;
        for (let j = 0; j < 7; j++) {
            if (aboneZamanVeTarihListesi[i][j] != "") {
                if (tarihleriKarsilastir(tarihOlustur(aboneZamanVeTarihListesi[i][j]), eklenenTarih)) {
                    check = true;
                    break
                }
            }
        }
        abonelikBoolListesi.push(check)
    }
    return abonelikBoolListesi;
}

function tarihleriKarsilastir(tarih: Date, eklenenTarih: Date): boolean {
    if (tarih.getTime() > eklenenTarih.getTime()) {
        return ((tarih.getTime() - eklenenTarih.getTime()) / (1000 * 3600 * 24)) % 7 == 0
    }

    return ((eklenenTarih.getTime() - tarih.getTime()) / (1000 * 3600 * 24)) % 7 == 0

}

function eklenenTarihIcınArkaPlanRengiOlustur(abonelikListesi: boolean[], normalRenk: string, abonelikRengi: string) {
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


function abonelikListesineTarihEkle(tarih: string, aboneZamanVeTarihListesi: string[][], index: number) {
    let kontrol: boolean = false;
    for (let i = 0; i < 7; i++) {
        if (aboneZamanVeTarihListesi[index][i] != "") {
            if (tarihleriKarsilastir(tarihOlustur(aboneZamanVeTarihListesi[index][i]), tarihOlustur(tarih))) {
                kontrol = true;
                break;
            }
        }
    }

    if (!kontrol) {
        for (let i = 0; i < 7; i++) {
            if (aboneZamanVeTarihListesi[index][i] == "") {
                aboneZamanVeTarihListesi[index][i] = tarih;
                break;
            }
        }
    }
}

function abonelikListesindenTarihSil(tarih: string, aboneZamanVeTarihListesi: string[][], index: number) {
    for (let i = 0; i < 7; i++) {
        if (aboneZamanVeTarihListesi[index][i] != "") {
            if (tarihleriKarsilastir(tarihOlustur(aboneZamanVeTarihListesi[index][i]), tarihOlustur(tarih))) {
                aboneZamanVeTarihListesi[index][i] = ""
                break;
            }
        }
    }

}

function arkaPlanRenginiBelirle(gün: Schedule, indeks: number, normalRenk: string, rezervasyonRengi: string) {
    gün.abonelikler[indeks] = false;
    if (gün.rezervasyonlar[indeks]) {
        gün.arkaPlanRenkleri[indeks] = rezervasyonRengi;
    } else {
        gün.arkaPlanRenkleri[indeks] = normalRenk;
    }
}

