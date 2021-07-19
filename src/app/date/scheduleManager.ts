import { Schedule } from "./schedule";

export class ScheduleManager {
    normalRenk: string
    rezervasyonRengi: string
    abonelikRengi: string
    zamanListesininUzunluğu: number
    aboneZamanVeTarihListesi: Array<Array<string>> = [[]]
    arananGun: Date;

    constructor(uzunluk: number, normalRenk: string, rezervasyonRengi: string, abonelikRengi: string) {
        this.zamanListesininUzunluğu = uzunluk;
        this.normalRenk = normalRenk;
        this.rezervasyonRengi = rezervasyonRengi;
        this.abonelikRengi = abonelikRengi;
        this.aboneZamanVeTarihListesi = AboneListesiOlustur(this.zamanListesininUzunluğu)
    }

    ilkListeyiOlustur(date: Date, günSayısı: number): Array<Schedule> {
        let günler: Array<Schedule> = []
        for (let i = 0; i < günSayısı; i++) {
            let today = gunEkle(date, i)
            günler.push({
                tarih: today.toLocaleDateString("tr-TR"),
                rezervasyonlar: varsayılanBoolListesiOlustur(this.zamanListesininUzunluğu),
                abonelikler: varsayılanBoolListesiOlustur(this.zamanListesininUzunluğu),
                zamanListesi: [],
                arkaPlanRenkleri: varsayılanArkaPlanRenkListesiOlustur(this.zamanListesininUzunluğu, this.normalRenk)
            })
        }

        return günler;
    }

    ZamanSutunuEkle(günler: Schedule[], zamanlar: string[]): Array<Schedule> {
        günler.unshift({
            tarih: "",
            rezervasyonlar: [],
            abonelikler: [],
            zamanListesi: zamanlar,
            arkaPlanRenkleri: varsayılanArkaPlanRenkListesiOlustur(this.zamanListesininUzunluğu, this.normalRenk)
        })
        return günler;
    }

    listeBasinaGunEkle(günler: Schedule[], ilkGun: string, cıkartılacakGunSayısı: number): Schedule[] {
        this.arananGun = gunCıkar(tarihOlustur(ilkGun), cıkartılacakGunSayısı);
        if (this.listedeGunAra(günler, this.arananGun) == -1) {

            for (let i = 0; i < cıkartılacakGunSayısı; i++) {

                let eklenenTarih = gunCıkar(tarihOlustur(günler[0].tarih), 1);
                let abonelikListesi = eklenenTarihIcınAbonelikKontrolu(eklenenTarih, this.aboneZamanVeTarihListesi, this.zamanListesininUzunluğu)
                let arkaplanRenkListesi = eklenenTarihIcınArkaPlanRengiOlustur(abonelikListesi, this.normalRenk, this.abonelikRengi)
                günler.unshift({
                    tarih: eklenenTarih.toLocaleDateString("tr-TR"),
                    rezervasyonlar: varsayılanBoolListesiOlustur(this.zamanListesininUzunluğu),
                    abonelikler: abonelikListesi,
                    zamanListesi: [],
                    arkaPlanRenkleri: arkaplanRenkListesi,
                })
            }

        }

        return günler;
    }

    listeSonunaGunEkle(günler: Schedule[], sonGun: string, eklenecekGunSayisi: number): Schedule[] {
        this.arananGun = gunEkle(tarihOlustur(sonGun), eklenecekGunSayisi);

        if (this.listedeGunAra(günler, this.arananGun) == -1) {
            for (let i = 0; i < eklenecekGunSayisi; i++) {

                let eklenenTarih = gunEkle(tarihOlustur(günler[günler.length - 1].tarih), 1);
                let abonelikListesi = eklenenTarihIcınAbonelikKontrolu(eklenenTarih, this.aboneZamanVeTarihListesi, this.zamanListesininUzunluğu)
                let arkaplanRenkListesi = eklenenTarihIcınArkaPlanRengiOlustur(abonelikListesi, this.normalRenk, this.abonelikRengi)
                günler.push({
                    tarih: eklenenTarih.toLocaleDateString("tr-TR"),
                    rezervasyonlar: varsayılanBoolListesiOlustur(this.zamanListesininUzunluğu),
                    abonelikler: abonelikListesi,
                    zamanListesi: [],
                    arkaPlanRenkleri: arkaplanRenkListesi,
                })
            }

        }
        return günler;

    }

    listedeGunAra(günler: Schedule[], arananTarih: Date): number {
        let index = -1
        for (let i = 0; i < günler.length; i++) {
            if (günler[i].tarih == arananTarih.toLocaleDateString("tr-TR")) {
                index = i
                break
            }
        }
        return index
    }

    aboneListeniTemizle() {
        for (let i = 0; i < this.zamanListesininUzunluğu; i++) {
            for (let j = 0; j < 7; j++) {
                this.aboneZamanVeTarihListesi[i][j] = ""
            }
        }
    }

    abonelikRezervasyonEkle(günler: Schedule[], secilmisGün: Schedule, zamanIndeksi: number) {
        let cevap = confirm("Abonelik mi?")
        let pozisyon = günler.indexOf(secilmisGün);
        if (cevap) {
            for (let i = pozisyon % 7; i < günler.length; i = i + 7) {
                if (günler[i].abonelikler[zamanIndeksi] == false) {
                    günler[i].abonelikler[zamanIndeksi] = true
                    günler[i].arkaPlanRenkleri[zamanIndeksi] = this.abonelikRengi;
                }
            }
            abonelikListesineTarihEkle(secilmisGün.tarih, this.aboneZamanVeTarihListesi, zamanIndeksi)
        } else {
            günler[pozisyon].rezervasyonlar[zamanIndeksi] = true
            günler[pozisyon].arkaPlanRenkleri[zamanIndeksi] = this.rezervasyonRengi;
        }
    }
    rezervasyonIptalEt(günler: Schedule[], secilmisGün: Schedule, zamanIndeksi: number) {
        let cevap = confirm("Silinsin mi?")
        let pozisyon = günler.indexOf(secilmisGün);
        if (cevap) {
            günler[pozisyon].rezervasyonlar[zamanIndeksi] = false
            günler[pozisyon].arkaPlanRenkleri[zamanIndeksi] = this.normalRenk;
        }
    }
    abonelikIptalEt(günler: Schedule[], secilmisGün: Schedule, zamanIndeksi: number) {
        let pozisyon = günler.indexOf(secilmisGün);
        let cevap = confirm("Silinsin mi?")
        if (cevap) {
            let cevap2 = confirm("Abonelik silinsin mi?")
            if (cevap2) {
                for (let i = pozisyon % 7; i < günler.length; i = i + 7) {
                    arkaPlanRenginiBelirle(günler[i], zamanIndeksi, this.normalRenk, this.rezervasyonRengi)
                }
                abonelikListesineTarihSil(secilmisGün.tarih, this.aboneZamanVeTarihListesi, zamanIndeksi)
            } else {
                arkaPlanRenginiBelirle(günler[pozisyon], zamanIndeksi, this.normalRenk, this.rezervasyonRengi)
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

function abonelikListesineTarihSil(tarih: string, aboneZamanVeTarihListesi: string[][], index: number) {
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

