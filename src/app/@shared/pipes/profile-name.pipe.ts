import { Pipe, PipeTransform } from '@angular/core';
import { PerfilUsuario } from '@app/@core/interfaces/categoria.models';

@Pipe({
  name: 'profileName',
})
export class ProfileNamePipe implements PipeTransform {
  transform(id: number, profiles: PerfilUsuario[]): string {
    if (profiles.length <= 0) return '';
    return profiles?.find((p) => p.iIdPerfil === id)?.sDescripcion || '';
  }
}
