import * as fs from 'fs'
import * as path from 'path'

writeTs('objectivesReferences', ['6C10'])
writeTs('unitsReferences', ['S6S1'])
writeTs('specialUnitsReferences', [''])

function writeTs (fileName, data) {
  fs.writeFileSync(path.join('./src', 'topmaths', 'types', fileName + '.ts'), `export const ${fileName} = <const> ${JSON.stringify(data, null, 2).replace(/"/g, '\'')}
`)
}
