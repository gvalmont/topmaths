import { Pipe, PipeTransform } from '@angular/core'
import { DomSanitizer} from '@angular/platform-browser'

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {
  // eslint-disable-next-line no-unused-vars
  constructor (private sanitizer: DomSanitizer) {}
  transform (url : string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

}
