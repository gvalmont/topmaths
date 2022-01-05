import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Competition } from '../competitions.component';

@Component({
  selector: 'app-competition-actuelle',
  templateUrl: './competition-actuelle.component.html',
  styleUrls: ['./competition-actuelle.component.css', '../competitions.component.css']
})
export class CompetitionActuelleComponent implements OnInit {
  @Input() competitionActuelle: Competition
  @Input() troisPetitsPoints: string
  @Output() fermerLobby = new EventEmitter<boolean>();

  constructor(public dataService: ApiService) {
    this.competitionActuelle = { id: 0, statut: '', profilOrganisateur: { id: 0, pseudo: '', codeAvatar: '', lienTrophees: '', score: 0, classement: 0, scoreEquipe: 0, teamName: '' }, dernierSignal: '', type: '', niveaux: [], sequences: [], listeDesUrl: [], listeDesTemps: [], minParticipants: 0, maxParticipants: 0, participants: [] }
    this.troisPetitsPoints = '...'
  }

  ngOnInit(): void {
  }
}
