import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';
import {Diplome, Filiere} from '../../entities/entities';
import {Router} from '@angular/router';
import {toBase64String} from '@angular/compiler/src/output/source_map';

@Component({
  selector: 'app-filieres',
  templateUrl: './filieres.component.html',
  styleUrls: ['./filieres.component.css']
})
export class FilieresComponent implements OnInit {
  filieresList: Filiere[];
  pagesArray: any;
  isLoaded: boolean = false;
  isError: boolean = false;
  currentPage: Boolean;
  dtOptions: any;

  constructor(private httpClient: HttpClient, private common: CommonService, private router: Router) {
  }

  ngOnInit() {
    this.getList();
  }

  async getList() {
    try {
      let data = await this.httpClient.get<Filiere>(this.common.url + '/filieres').toPromise();
      this.filieresList = data['_embedded'].filieres;
      for (const filiere of this.filieresList) {
        filiere.diplome = <Diplome> await this.httpClient.get(filiere._links['diplome']['href']).toPromise();
      }
      this.isLoaded = true;

      this.dtOptions = {
        order: [[0, 'asc']],
        'language': {
          url: 'assets/French.json'
        },

      };
    } catch (e) {
      this.isError = true;
      this.common.toastMessage(this.common.messages.error.title, this.common.messages.error.message.get);

    }

  }

  async onDelete(filiere: Filiere) {
    if (!confirm('Etes vous sure de vouloir supprimer ')) {
      return;
    }
    try {
      let data = await this.httpClient.get(filiere._links['sessions']['href']).toPromise();
      if (data['_embedded']['sessions'].length > 0) {
        this.common.toastMessage('Erreur', 'Cette filiere est liée à des sessions.');
        return;
      }
      await this.httpClient.delete(this.common.url + '/filieres/' + filiere.id).toPromise();
      this.common.toastMessage('Success', 'Suppression réussite.');
      this.getList();

    } catch (e) {

      this.common.toastMessage('Error', 'Une erreur s\'est produite lors de l\'opération de suppresison');
    }


  }

  onEdit(filiere: Filiere) {
    this.router.navigateByUrl('/admin/filieres/edit/' + btoa(filiere._links.self.href));
    console.log('Editind of ');
    console.log(filiere);

  }
}
