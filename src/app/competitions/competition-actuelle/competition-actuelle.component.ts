import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Competition } from '../competitions.component';

@Component({
  selector: 'app-competition-actuelle',
  templateUrl: './competition-actuelle.component.html',
  styleUrls: ['./competition-actuelle.component.css', '../competitions.component.css']
})
export class CompetitionActuelleComponent implements OnInit, OnDestroy {
  @Input() competitionActuelle: Competition
  @Input() troisPetitsPoints: string
  @Input() details: boolean
  @Output() fermerLobby = new EventEmitter<boolean>();
  dateInterval: any
  tempsRestant: string
  largeurPreview: number
  hauteurPreview: number
  isMobile: boolean

  constructor(public dataService: ApiService) {
    this.competitionActuelle = { id: 0, statut: '', profilOrganisateur: { id: 0, pseudo: '', codeAvatar: '', lienTrophees: '', score: 0, classement: 0, scoreEquipe: 0, teamName: '', aRepondu: 0 }, dernierSignal: '', type: '', niveaux: [], sequences: [], listeDesUrl: [], listeDesTemps: [], minParticipants: 0, maxParticipants: 0, participants: [], coef: 0, url: '', temps: 0, question: 0 }
    this.troisPetitsPoints = '...'
    this.details = false
    this.tempsRestant = ''
    this.largeurPreview = 640
    this.hauteurPreview = 300
    this.isMobile = true
  }

  ngOnInit(): void {
    this.redimensionnePreviewIframe()
    this.dateInterval = setInterval(() => {
      this.majTempsRestant()
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.dateInterval)
  }

  /**
   * Met à jour le temps restant affiché
   */
  majTempsRestant() {
    let dernierSignal = new Date(this.competitionActuelle.dernierSignal);
    dernierSignal.setMinutes(dernierSignal.getMinutes() - dernierSignal.getTimezoneOffset() - 60); //Le serveur mysql semble être en UTC + 1

    const dateFin = dernierSignal.getTime() + this.competitionActuelle.temps * 1000 + 30 * 1000

    const now = new Date()
    this.tempsRestant = Math.max(0, Math.floor(((dateFin - now.getTime()) / 1000))).toString()
  }

  /**
   * Détecte les changements de taille de fenêtre,
   * ajuste les dimensions de l'iframe de preview en conséquence
   * @param event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.redimensionnePreviewIframe()
  }

  /**
   * Set la variable isMobile, la largeurPreview et le hauteurPreview
   */
  redimensionnePreviewIframe() {
    if (window.innerWidth > 768) {
      this.isMobile = false
      this.largeurPreview = window.innerWidth - 400
      this.hauteurPreview = this.getParticipantsHeight()
    } else {
      this.isMobile = true
      this.largeurPreview = window.innerWidth - 100
      this.hauteurPreview = 300
    }
  }

  /**
   * Renvoie le maxiumum entre la hauteur du divparticipants + 50 et 300
   * @returns 
   */
  getParticipantsHeight() {
    const divParticipants = document.getElementById('divParticipants')
    if (divParticipants != null) {
      return Math.max(divParticipants.offsetHeight + 50, 300)
    } else {
      return 300
    }
  }
}
