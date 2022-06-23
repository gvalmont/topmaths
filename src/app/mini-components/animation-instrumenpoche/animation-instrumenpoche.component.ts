import { HttpClient } from '@angular/common/http'
import { Component, Input, OnInit } from '@angular/core'
declare const iep: any

@Component({
  selector: 'app-animation-instrumenpoche',
  templateUrl: './animation-instrumenpoche.component.html',
  styleUrls: ['./animation-instrumenpoche.component.css']
})
export class AnimationInstrumenpocheComponent implements OnInit {
  @Input() nomAnimation: string
  largeurAnimation: string = '600'
  hauteurAnimation: string = '600'

  // eslint-disable-next-line no-unused-vars
  constructor(private httpClient: HttpClient) {
    this.nomAnimation = ''
    this.largeurAnimation = '600'
    this.hauteurAnimation = '600'
  }

  ngOnInit(): void {
    /**
     * Affiche une erreur dans la page
     * @param {Error|string} error
     */
    function displayError(error: any) {
      console.error(error)
      const pre = document.createElement('pre')
      const txt = document.createTextNode(error.toString())
      pre.appendChild(txt)
      const errorsHTML = document.getElementById('errors')
      if (errorsHTML !== null) errorsHTML.appendChild(pre)
    }
    try {
      this.httpClient.request('GET', 'assets/data/instrumenpoche/' + this.nomAnimation + '.xml', {responseType:'text'}).subscribe(xml => {
        const container = document.getElementById("svgContainer")
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svg.setAttributeNS(null, "width", this.largeurAnimation)
        svg.setAttributeNS(null, "height", this.hauteurAnimation)
        svg.setAttributeNS(null, "id", "svg")
        if (container !== null) {
          container.appendChild(svg)
          const iepApp = new iep.iepApp()
          iepApp.addDoc(svg, xml.replace(/\$/g, ''), true /* autostart */)
        }
      })
    } catch (error) {
      displayError("Le lecteur a échoué à lire le script fourni")
      console.error(error)
    }
  }
}
