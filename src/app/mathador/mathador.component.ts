import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mathador',
  templateUrl: './mathador.component.html',
  styleUrls: ['./mathador.component.css']
})
export class MathadorComponent implements OnInit {
  cible: number
  a: number
  b: number
  c: number
  d: number
  e: number

  constructor() {
    this.cible = this.randint(1, 100)
    this.a = this.randint(1, 4)
    this.b = this.randint(1, 6)
    this.c = this.randint(1, 8)
    this.d = this.randint(1, 12)
    this.e = this.randint(1, 20)
  }

  ngOnInit(): void {
    this.testerMathador()
  }

  randint(min: number, max: number, exclus: number[] = []) {
    return Math.floor(Math.random() * (max - min) + min)
  }

  testerMathador() {
    const nombres = [this.a, this.b, this.c, this.d, this.e]
    const signes = ['+', '-', '*', '/']
    for (const nombre1 of nombres) {
      for (const signe1 of signes) {
        const nombres1 = nombres.filter(function (value, index, arr) {
          return value !== nombre1;
        })
        while (nombres1.length < nombres.length - 1) nombres1.push(nombre1)
        const signes1 = signes.filter(function (value, index, arr) {
          return value !== signe1;
        })
        console.log(signes1)
      }
    }
  }

  calcul(nombre1: number, nombre2: number, operation: string) {
    switch (operation) {
      case '+':
      return nombre1 + nombre2
        break;
      case '-':
        return nombre1 - nombre2
        break;
      case '*':
        return nombre1 * nombre2
        break;
      case '/':
        return nombre1 / nombre2
        break;
      default:
        console.log('Erreur : signe d\'opération inconnu')
        return 0
        break;
    }
  }
}
