/**
 * Adapted from https://www.ngdevelop.tech/loading-external-libraries-from-cdn-in-angular-application/
 */
import { Injectable } from '@angular/core'

interface Scripts {
  name: string;
  src: string;
}

export const ScriptStore: Scripts[] = [
  { name: 'sheetJs', src: 'https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js' }
]

@Injectable({
  providedIn: 'root'
})
export class ScriptService {

  private scripts: any = {}

  constructor () {
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      }
    })
  }

  load (...scripts: string[]) {
    const promises: any[] = []
    scripts.forEach((script) => promises.push(this.loadScript(script)))
    return Promise.all(promises)
  }

  loadScript (name: string) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      // resolve if already loaded
      if (this.scripts[name].loaded) {
        resolve({ script: name, loaded: true, status: 'Already Loaded' })
      } else {
        // load script
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = this.scripts[name].src
        script.onload = () => {
          this.scripts[name].loaded = true
          resolve({ script: name, loaded: true, status: 'Loaded' })
        }
        script.onerror = (error: any) => {
          console.log(error)
          resolve({ script: name, loaded: false, status: 'Loaded' })
        }
        document.getElementsByTagName('head')[0].appendChild(script)
      }
    })
  }
}