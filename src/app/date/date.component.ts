import { Component, OnInit } from '@angular/core';
import { Schedule } from './schedule';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit {
  alldates: Array<Schedule> = []
  dates: Array<Schedule> = []
  subscriptions = [
    ["0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0"],
  ]
  constructor() {
    createFirstDateList(new Date, this.alldates, this.dates, 20);
  }

  ngOnInit(): void {

  }
  aWeekAgo() {
    let date = this.dates[1].date;
    this.dates = addDatesBeginigOfTheList(decreaseDate(getDateFromString(date), 7), this.alldates, 7, this.subscriptions)
  }
  dayBefore() {
    let date = this.dates[1].date
    this.dates = addDatesBeginigOfTheList(decreaseDate(getDateFromString(date), 1), this.alldates, 1, this.subscriptions)
  }
  today() {
    this.dates = []
    this.alldates = []
    clearSubscriptionList(this.subscriptions)
    createFirstDateList(new Date(), this.alldates, this.dates, 20)
  }
  dayAfter() {
    let date = this.dates[20].date
    this.dates = addDatesEndOfTheList(increaseDate(getDateFromString(date), 1), this.alldates, 1, this.subscriptions)
  }
  aWeekAfter() {
    let date = this.dates[20].date
    this.dates = addDatesEndOfTheList(increaseDate(getDateFromString(date), 7), this.alldates, 7, this.subscriptions)
  }
  clickOn(date: Schedule, index) {
    let pos = this.dates.indexOf(date)
    if (pos != 0) {
      if(this.dates[pos].allSelect[index] && this.dates[pos].back[index]=="white" 
      || this.dates[pos].allSelect[index] && this.dates[pos].back[index]=="lightblue"){
        if(this.dates[pos].isSelect[index]){
          let answer = confirm("Silinsin mi?")
          if (answer) {
            this.dates[pos].isSelect[index] = false
            this.dates[pos].back[index] = "white"
          }
        }else {
          let answer = confirm("Abonelik mi?")
          if(!answer){
            this.dates[pos].isSelect[index] = true
            this.dates[pos].back[index] = "lightblue"
          }
        }
        
      }else {
        if (this.dates[pos].allSelect[index]) {
          let answer = confirm("Silinsin mi?")
          if (answer) {
            let answer2 = confirm("Abonelik silinsin mi?")
            if (answer2) {
              let i = pos % 7
              for (i; i < this.dates.length; i = i + 7) {
                if(this.dates[i].back[index]=="blue"){
                  this.dates[i].allSelect[index] = false
                  if (this.dates[i].isSelect[index]) {
                    this.dates[i].back[index] = "lightblue"
                  } else {
                    this.dates[i].back[index] = "white"
                  }
                }
                
              }
              removeSubscriptions(date.date, this.subscriptions, index)
              updateAlldateListAfterRemoveSubsc(this.alldates, date, index)
            } else {
              this.dates[pos].allSelect[index] = true
              if (this.dates[pos].isSelect[index]) {
                this.dates[pos].back[index] = "lightblue"
              } else {
                this.dates[pos].back[index] = "white"
              }
            }
          }
        } else if (this.dates[pos].isSelect[index]) {
          let answer = confirm("Silinsin mi?")
          if (answer) {
            this.dates[pos].isSelect[index] = false
            this.dates[pos].back[index] = "white"
          }
        } else {
          let answer = confirm("Abonelik mi?")
          if (answer) {
            let i = pos % 7
            for (i; i < this.dates.length; i = i + 7) {
              if (i == 0) {
                continue;
              }
              if(this.dates[i].allSelect[index]==false){
                this.dates[i].allSelect[index] = true
                this.dates[i].back[index] = "blue"
              }
             
            }
            addSubscriptions(date.date, this.subscriptions, index)
            updateAlldateListAfterAddSubsc(this.alldates, date, index)
  
          } else {
            this.dates[pos].isSelect[index] = true
            this.dates[pos].back[index] = "lightblue"
          }
        }
      }
      
    }
  }
}

function increaseDate(date: Date, days: number): Date {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function decreaseDate(date: Date, days: number): Date {
  var result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

function createFirstDateList(date: Date, alldates: Schedule[], dates: Schedule[], range: number) {
  for (let i = 0; i < range; i++) {
    const today = increaseDate(date, i)
    alldates.push({
      date: today.toLocaleDateString(),
      isSelect: [false, false, false, false, false, false, false, false, false],
      allSelect: [false, false, false, false, false, false, false, false, false],
      time: [],
      back: ["white", "white", "white", "white", "white", "white", "white", "white", "white"],
    })
  }

  for (let j = 0; j < range; j++) {
    dates.push(alldates[j])
  }
  addTimeColumn(dates);
}

function addTimeColumn(dates: Schedule[]) {
  dates.unshift({
    date: "",
    isSelect: [false, false, false, false, false, false, false, false, false],
    allSelect: [false, false, false, false, false, false, false, false, false],
    time: [
      "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"
    ],
    back: ["white", "white", "white", "white", "white", "white", "white", "white", "white"],
  })
}

function getDateFromString(date: string): Date {
  var input = date.split(".")
  var day = parseInt(input[0], 10)
  var month = parseInt(input[1], 10)
  var year = parseInt(input[2], 10)
  var newdate = new Date(year, month - 1, day);
  return newdate;
}

function addDatesBeginigOfTheList(lastdate: Date, alldates: Schedule[], range: number, subscriptions: string[][]): Schedule[] {
  let dates: Array<Schedule> = []
  if (findIndex(alldates, lastdate) == -1) {
    for (let i = 0; i < range; i++) {

      let newdate = decreaseDate(getDateFromString(alldates[0].date), 1);
      let selectList = createallSelectList(newdate, subscriptions)
      let colors = createBackColorList(selectList)
      alldates.unshift({
        date: newdate.toLocaleDateString(),
        isSelect: [false, false, false, false, false, false, false, false, false],
        allSelect: selectList,
        time: [],
        back: colors,
      })
    }
  }
  let position = findIndex(alldates, lastdate)
  for (let i = 0; i < 20; i++) {
    dates.push(alldates[position + i])
  }
  addTimeColumn(dates);
  return dates;
}

function addDatesEndOfTheList(lastdate: Date, alldates: Schedule[], range: number, subscriptions: string[][]): Schedule[] {
  let dates: Array<Schedule> = []
  if (findIndex(alldates, lastdate) == -1) {
    for (let i = 0; i < range; i++) {
      let newdate = increaseDate(getDateFromString(alldates[alldates.length - 1].date), 1);
      let selectList = createallSelectList(newdate, subscriptions)
      let colors = createBackColorList(selectList)
      alldates.push({
        date: newdate.toLocaleDateString(),
        isSelect: [false, false, false, false, false, false, false, false, false],
        allSelect: selectList,
        time: [],
        back: colors
      })
    }
  }
  let position = findIndex(alldates, lastdate)
  position = position - 19;
  for (let i = 0; i < 20; i++) {
    dates.push(alldates[position + i])
  }
  addTimeColumn(dates);
  return dates;
}

function findIndex(alldates: Schedule[], date: Date): number {
  let index = -1
  for (let i = 0; i < alldates.length; i++) {
    if (alldates[i].date == date.toLocaleDateString()) {
      index = i
      break
    }
  }
  return index
}

function updateAlldateListAfterRemoveSubsc(alldates: Schedule[], date: Schedule, index: number) {
  let pos = alldates.indexOf(date)
  let i = pos % 7
  for (i; i < alldates.length; i = i + 7) {
    if(alldates[i].back[index]=="blue"){
      alldates[i].allSelect[index] = false
      if (alldates[i].isSelect[index]) {
        alldates[i].back[index] = "lightblue"
      } else {
        alldates[i].back[index] = "white"
      }
    }
   
  }

}

function updateAlldateListAfterAddSubsc(alldates: Schedule[], date: Schedule, index: any) {
  let pos = alldates.indexOf(date)
  let i = pos % 7
  for (i; i < alldates.length; i = i + 7) {
    if(alldates[i].allSelect[index]==false){
      alldates[i].allSelect[index] = true
      alldates[i].back[index] = "blue"
    }
   
  }
}

function addSubscriptions(date: string, subscriptions: string[][], index: number) {
  for (let i = 0; i < 7; i++) {
    if (subscriptions[index][i] == "0") {
      subscriptions[index][i] = date
      break;
    }
  }
}
function removeSubscriptions(date: string, subscriptions: string[][], index: any) {
  for (let i = 0; i < 7; i++) {
    if (getDateFromString(subscriptions[index][i]).getTime() > getDateFromString(date).getTime()) {
      if (((getDateFromString(subscriptions[index][i]).getTime() - getDateFromString(date).getTime()) / (1000 * 3600 * 24)) % 7 == 0) {
        subscriptions[index][i] = "0"
        break;
      }
    } else {
      if (((getDateFromString(date).getTime() - getDateFromString(subscriptions[index][i]).getTime()) / (1000 * 3600 * 24)) % 7 == 0) {
        subscriptions[index][i] = "0"
        break;
      }
    }

  }
}

function createallSelectList(newdate: Date, subscriptions: string[][]): boolean[] {
  var isSelectedAll = [];
  for (let i = 0; i < 9; i++) {
    let check = false;
    for (let j = 0; j < 7; j++) {
      if (subscriptions[i][j] != "0") {
        if (getDateFromString(subscriptions[i][j]).getTime() > newdate.getTime()) {
          if (((getDateFromString(subscriptions[i][j]).getTime() - newdate.getTime()) / (1000 * 3600 * 24)) % 7 == 0) {
            check = true;
            break;
          }
        } else {
          if (((newdate.getTime() - getDateFromString(subscriptions[i][j]).getTime()) / (1000 * 3600 * 24)) % 7 == 0) {
            check = true;
            break;
          }
        }

      }
    }
    isSelectedAll.push(check)
  }
  return isSelectedAll;
}

function createBackColorList(selectList: boolean[]): string[] {
  var backColors = [];
  for (let i = 0; i < selectList.length; i++) {
    if (selectList[i]) {
      backColors.push("blue")
    } else {
      backColors.push("white")
    }
  }
  return backColors;
}

function clearSubscriptionList(subscriptions: string[][]) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 7; j++) {
      subscriptions[i][j] = "0"
    }
  }
}

